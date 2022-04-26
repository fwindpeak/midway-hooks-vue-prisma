import {
  Api,
  Delete,
  Get,
  Params,
  Post,
  Put,
  Query,
  useContext,
  Validate,
  ValidateHttp
} from '@midwayjs/hooks'
import type { Context } from '@midwayjs/koa'
import { prisma } from './prisma'
import { z } from 'zod'

function usePostId() {
  const ctx = useContext<Context>()
  return Number(ctx.params.id)
}

const IdSchema = z.object({
  id: z.string().regex(/^\d+$/)
})

type Id = z.infer<typeof IdSchema>

export const getPost = Api(
  Get('/api/post/:id'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const id = usePostId()
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true }
    })
    return post
  }
)

const QuerySchema = z.object({
  searchString: z.string().optional()
})

type SearchQuery = z.infer<typeof QuerySchema>

export const filterPosts = Api(
  Get('/api/filterPosts'),
  Query<SearchQuery>(),
  ValidateHttp({ query: QuerySchema }),
  async () => {
    const ctx = useContext<Context>()
    const searchString = ctx.query.searchString as string

    const resultPosts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } }
        ]
      }
    })

    return resultPosts
  }
)

export const listDrafts = Api(Get('/api/listDrafts'), async () => {
  const posts = await prisma.post.findMany({
    where: { published: false },
    include: { author: true }
  })
  return posts
})

export const listPosts = Api(Get('/api/listPosts'), async () => {
  const posts = await prisma.post.findMany({
    include: { author: true }
  })
  return posts
})

const PostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  authorEmail: z.string().email()
})

export const createPost = Api(
  Post('/api/post/'),
  Validate(PostSchema),
  async (post: z.infer<typeof PostSchema>) => {
    const result = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        author: { connect: { email: post.authorEmail } }
      }
    })
    return result
  }
)

export const editPost = Api(
  Put('/api/post/:id'),
  Params<{ id: string }>(),
  Validate(PostSchema),
  async (post: z.infer<typeof PostSchema>) => {
    const id = usePostId()
    const result = await prisma.post.update({
      where: { id },
      data: {
        title: post.title,
        content: post.content,
        author: { connect: { email: post.authorEmail } }
      }
    })
    return result
  }
)

export const publishPost = Api(
  Put('/api/post/publish/:id'),
  Params<{ id: string }>(),
  async () => {
    const id = usePostId()
    const post = await prisma.post.update({
      where: { id },
      data: { published: true }
    })
    return post
  }
)

export const deletePost = Api(
  Delete('/api/post/:id'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const id = usePostId()
    const post = await prisma.post.delete({
      where: { id }
    })
    return post
  }
)
