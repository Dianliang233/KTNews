import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function Story({ params }: { params: { story: string } }) {
  async function getStory(slug: string) {
    'use server'
    const story = await prisma.story.findUnique({
      where: { slug },
    })
    if (!story) {
      notFound()
    }
    return story
  }

  const story = await getStory(params.story)

  return (
    <article>
      <h1>Story</h1>
    </article>
  )
}
