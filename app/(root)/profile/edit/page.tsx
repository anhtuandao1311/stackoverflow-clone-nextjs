import ProfileForm from "@/components/forms/ProfileForm"
import { getUserById } from "@/lib/actions/user.action"
import { ParamsProps } from "@/types"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function page({ params }: ParamsProps) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")
  const mongoUser = await getUserById({ userId })
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <ProfileForm clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </div>
  )
}
