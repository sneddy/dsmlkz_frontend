"use client"

import Link from "next/link"
import { BlobImage } from "@/components/ui/blob-image"

type Member = {
  id: string
  nickname: string
  first_name: string
  last_name: string
  current_city?: string
  university?: string
  relevant_company?: string
  relevant_position?: string
  avatar_url?: string
}

interface MemberMiniCardProps {
  member: Member
  isSelected?: boolean
  onClick?: () => void
}

export function MemberMiniCard({ member, isSelected = false, onClick }: MemberMiniCardProps) {
  return (
    <Link
      href={`/users/${member.nickname}`}
      className={`flex items-center gap-3 p-2 hover:bg-accent rounded-md ${isSelected ? "bg-accent" : ""}`}
      onClick={onClick}
    >
      <BlobImage
        src={
          member.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${member.first_name} ${member.last_name}`
        }
        alt={`${member.first_name} ${member.last_name}`}
        width={40}
        height={40}
        className="rounded-full h-10 w-10 flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">
          {member.first_name} {member.last_name}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {member.relevant_position
            ? `${member.relevant_position}${member.relevant_company ? ` @ ${member.relevant_company}` : ""}`
            : `@${member.nickname}`}
        </p>
      </div>
    </Link>
  )
}
