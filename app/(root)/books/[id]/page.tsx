import React from "react";
import { db } from "@/database/drizzle";
import { books, bookReviews, users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import ReviewsSection from "@/components/ReviewsSection";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  // Fetch data based on id
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/404");

  // Fetch reviews for this book
  const reviews = await db
    .select({
      id: bookReviews.id,
      rating: bookReviews.rating,
      comment: bookReviews.comment,
      createdAt: bookReviews.createdAt,
      updatedAt: bookReviews.updatedAt,
      userFullName: users.fullName,
      userEmail: users.email,
    })
    .from(bookReviews)
    .innerJoin(users, eq(bookReviews.userId, users.id))
    .where(eq(bookReviews.bookId, id))
    .orderBy(desc(bookReviews.createdAt));

  return (
    <>
      <BookOverview
        {...bookDetails}
        userId={session?.user?.id as string}
        isDetailPage={true}
      />

      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>

            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>

            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section className="mt-10 flex flex-col gap-7">
            <ReviewsSection
              bookId={id}
              reviews={reviews}
              currentUserEmail={session?.user?.email}
            />
          </section>
        </div>

        {/*  SIMILAR*/}
      </div>
    </>
  );
};
export default Page;
