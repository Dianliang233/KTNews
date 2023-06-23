import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/date'
import Image from 'next/image'
import contentCss from './content.module.css'
import { cn } from '@/lib/utils'

export default async function Story({ params }: { params: { story: string } }) {
  async function getStory(slug: string) {
    'use server'
    const story = await prisma.story.findUnique({
      where: { slug },
      include: {
        medias: true,
        category: true,
        primarySources: true,
      },
    })
    if (!story) {
      notFound()
    }
    return story
  }

  const story = await getStory(params.story)
  const hasMedia = story.medias.length !== 0

  return (
    <div className="w-full">
      <div
        className={cn('mb-6')}
        style={{
          backgroundColor: `hsl(${Math.floor(Math.random() * 361)}, 85%, 95%)`,
        }}
      >
        <div className="container pt-24 grid grid-rows-2 md:grid-rows-1 md:grid-cols-3 min-h-[60vh] gap-5">
          <hgroup className={cn('mb-8', hasMedia ? null : 'md:col-span-2')}>
            <nav className="font-medium text-gray-500 pl-2 mb-3">
              <ol className="w-full list-none p-0 inline-flex">
                <li className="flex items-center basis-auto">
                  <Link
                    className="block"
                    href={`/category/${story.category.slug}`}
                  >
                    {story.category.name}
                  </Link>
                  <span className="ml-2">/</span>
                </li>
              </ol>
            </nav>
            <h1 className="text-5xl leading-normal font-bold my-3">
              {story.title}
            </h1>
            <p className="mb-2">{story.description}</p>
            <p className="text-sm text-gray-500">
              {formatDate(story.datePublished)}
            </p>
            <p className="text-sm text-gray-500">
              最后更新于 {formatDate(story.dateUpdated)}
            </p>
          </hgroup>
          {hasMedia && (
            <figure className="h-full md:col-span-2 flex flex-col">
              <div className="block relative h-full flex-1 mb-3">
                <Image
                  // src={frontmatter.image}
                  fill
                  // alt={frontmatter.imageAlt}
                  className="h-auto object-cover rounded-2xl"
                />
              </div>
              <figcaption className="text-sm text-gray-500">
                {/* {frontmatter.imageCaption} */}
              </figcaption>
            </figure>
          )}
        </div>
      </div>
      <div className="container mb-6 grid grid-rows-2 md:grid-rows-1 md:grid-cols-3 gap-5">
        <article
          className={cn(
            'md:col-span-2 text-lg leading-relaxed tracking-wide',
            contentCss.content
          )}
          dangerouslySetInnerHTML={{ __html: story.content }}
        ></article>
        <aside className={cn('md:col-span-1')}>
          <h2 className="text-xl font-extrabold">来源</h2>
          {story.primarySources.length !== 0 &&
            story.primarySources.map((source) => <>{source.name}</>)}
        </aside>
      </div>
    </div>
  )
}
