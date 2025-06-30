"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface CollaborationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  details: string
}

export function CollaborationModal({ isOpen, onClose, title, description, details }: CollaborationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-pixel text-[#00AEC7] text-lg pr-8">{title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-[#00AEC7]/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-[#FFF32A] font-medium">{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{details}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
