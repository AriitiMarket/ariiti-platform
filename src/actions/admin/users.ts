"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User, { UserRole } from "@/models/User";
import AuditLog from "@/models/AuditLog";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createAdminUser(formData: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Super Admin clearance required." };
    }

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      return { success: false, error: "All fields are required." };
    }

    if (formData.password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long." };
    }

    await connectDB();

    const existingUser = await User.findOne({ email: formData.email.toLowerCase().trim() });
    if (existingUser) {
      return { success: false, error: "A user with this email address already exists." };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(formData.password, salt);

    const newUser = await User.create({
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      passwordHash,
      role: formData.role,
      isActive: true,
    });

    await AuditLog.create({
      actorId: session.user.id,
      actorEmail: session.user.email,
      action: "CREATE",
      entityType: "USER",
      entityId: newUser._id.toString(),
      summary: `Created admin user ${newUser.email} with role ${newUser.role}`,
    });

    revalidatePath("/admin/users");
    return { success: true, user: { id: newUser._id.toString(), name: newUser.name, email: newUser.email, role: newUser.role } };
  } catch (error: unknown) {
    console.error("[ERROR] createAdminUser failed:", error);
    return { success: false, error: "Failed to create administrator account." };
  }
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Super Admin clearance required." };
    }

    if (session.user.id === userId) {
      return { success: false, error: "You cannot deactivate your own active session." };
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: "User account not found." };
    }

    user.isActive = isActive;
    await user.save();

    await AuditLog.create({
      actorId: session.user.id,
      actorEmail: session.user.email,
      action: "STATUS_CHANGE",
      entityType: "USER",
      entityId: user._id.toString(),
      summary: `${isActive ? "Activated" : "Suspended"} admin account ${user.email}`,
    });

    revalidatePath("/admin/users");
    return { success: true, isActive: user.isActive };
  } catch (error: unknown) {
    console.error("[ERROR] toggleUserStatus failed:", error);
    return { success: false, error: "Failed to update account status." };
  }
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Super Admin clearance required." };
    }

    if (session.user.id === userId && newRole !== "SUPER_ADMIN") {
      return { success: false, error: "You cannot revoke your own Super Admin privileges." };
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: "User account not found." };
    }

    const previousRole = user.role;
    user.role = newRole;
    await user.save();

    await AuditLog.create({
      actorId: session.user.id,
      actorEmail: session.user.email,
      action: "UPDATE",
      entityType: "USER",
      entityId: user._id.toString(),
      summary: `Updated role of ${user.email} from ${previousRole} to ${newRole}`,
    });

    revalidatePath("/admin/users");
    return { success: true, role: user.role };
  } catch (error: unknown) {
    console.error("[ERROR] updateUserRole failed:", error);
    return { success: false, error: "Failed to update user role." };
  }
}
