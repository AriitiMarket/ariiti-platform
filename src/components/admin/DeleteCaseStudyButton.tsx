"use client";

import React, { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCaseStudy } from "@/actions/adminCmsActions";

interface DeleteCaseStudyButtonProps {
  id: string;
  title: string;
}

export const DeleteCaseStudyButton: React.FC<DeleteCaseStudyButtonProps> = ({
  id,
  title,
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete the case study "${title}"? This cannot be undone.`
      )
    ) {
      startTransition(async () => {
        const res = await deleteCaseStudy(id);
        if (!res.success) {
          alert(res.error || "Failed to delete case study.");
        }
      });
    }
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border border-slate-200 shadow-2xs disabled:opacity-50"
      title="Delete case study"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
};

export default DeleteCaseStudyButton;
