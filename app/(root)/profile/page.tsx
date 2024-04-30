import { Button } from "@/components/ui/button"
import { getUserInfo } from "@/lib/actions/user.action"
import { URLProps } from "@/types"
import { SignedIn, auth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatJoinedDate } from "@/lib/utils"
import ProfileLink from "@/components/shared/ProfileLink"
import Stats from "@/components/shared/Stats"
import QuestionTab from "@/components/shared/QuestionTab"
import AnswerTab from "@/components/shared/AnswerTab"

export default async function page({ params, searchParams }: URLProps) {
  const { userId: clerkId } = auth()
  if (!clerkId) return null
  const userInfo = await getUserInfo({ userId: clerkId })
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo.user.picture}
            width={140}
            height={140}
            alt="profile pic"
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo.user.username}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolioWebsite}
                  title={userInfo.user.portfolioWebsite}
                />
              )}
              {userInfo.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={formatJoinedDate(userInfo.user.joinedAt)}
              />
            </div>
            {userInfo.user.bio && (
              <>
                <h4 className="h3-semibold text-dark200_light900 pt-4">Bio</h4>
                <p className="paragraph pt-2">{userInfo.user.bio}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link href={"/profile/edit"}>
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] shadow">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
        badgeCounts={userInfo.badgeCounts}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-questions" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-questions" className="tab">
              Top Questions
            </TabsTrigger>
            <TabsTrigger value="top-answers" className="tab">
              Top Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-questions">
            <QuestionTab
              userId={userInfo.user._id}
              searchParams={searchParams}
              clerkId={clerkId || ""}
            />
          </TabsContent>
          <TabsContent value="top-answers">
            <AnswerTab
              userId={userInfo.user._id}
              searchParams={searchParams}
              clerkId={clerkId || ""}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
