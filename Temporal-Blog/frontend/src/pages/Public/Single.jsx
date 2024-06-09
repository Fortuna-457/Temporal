import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import postService from '../../services/postService'
import useAlertToast from '../../hooks/useToast.jsx'
import { Spinner, Typography } from '@material-tailwind/react'
import DefaultNavbar from '../../components/Navbar/DefaultNavbar.jsx'
import DefaultSidebar from '../../components/Sidebars/DefaultSidebar.jsx'
import { usePostThumbnailPreview } from '../../hooks/useImagePreview'
import BlogCategoryLink from '../../components/Links/BlogCategoryLink'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'

// Components
import AuthenticatedUserCommentForm from '../../components/Forms/SinglePost/AuthenticatedUserCommentForm'
import UnauthenticatedUserCommentForm from '../../components/Forms/SinglePost/UnauthenticatedUserCommentForm'
import CommentCard from '../../components/Cards/Single/CommentCard'
import AuthorCard from '../../components/Cards/AuthorCard'
import PostsCard from '../../components/Cards/Single/PostsCard'
import { DefaultFooter } from '../../components/Footer/DefaultFooter.jsx'

function PostThumbnail({ thumbnail }) {
  const preview = usePostThumbnailPreview(thumbnail)

  return (
    <img
      src={preview}
      alt='TemporalTrek'
      className='absolute inset-0 w-full h-full object-cover'
    />
  )
}
export default function SinglePost() {
  let { id } = useParams()
  const { toast } = useAlertToast()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const isAuthenticated = useIsAuthenticated()

  /**
   * This only runs once when the component mounts
   * It fetches the post from the server by params id
   * and saves in the post state
   */
  useEffect(() => {
    async function getPost() {
      try {
        // Fetch the post from the server
        const response = await postService.getPostById(id)

        if (!response.ok) {
          console.log('Failed to get post: ', response.message)
          toast.showError(response.message || 'Error in request')
          return
        }

        // Extract the posts from the response
        const post = response.body
        // Save the post in the state
        setPost(post)
        // Set loading to false
        setLoading(false)
      } catch (error) {
        // If there's an error, set the error message
        console.log(error)
        toast.showError(error.message || 'Error in request')
        setLoading(false)
      }
    }

    getPost()
  }, [id])

  return loading ? (
    <Spinner />
  ) : (
    <div className='bg-gray-200 dark:bg-gray-900'>
      <DefaultNavbar />
      <main>
        <div className='w-full h-[calc(100vh-40vh)] relative'>
          <PostThumbnail thumbnail={post.thumbnail} />
          <div className='absolute inset-0 h-full w-full bg-black/50 z-0'></div>
          <div className='relative container mx-auto h-full pb-20 flex items-end gap-2 px-2 lg:px-0'>
            {post.categories.map((categoryId) => (
              <BlogCategoryLink categoryId={categoryId} key={categoryId} />
            ))}
          </div>
        </div>
        <div className='relative container flex gap-4 lg:gap-2 flex-col lg:flex-row mx-auto -mt-16 pb-4 px-2 lg:px-0'>
          <div className='w-full h-full flex flex-col gap-6'>
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md'>
              {/* <-------- POST TITLE --------> */}
              <div className='p-4 flex flex-col gap-4'>
                <Typography variant='h2' className='dark:text-gray-100'>
                  {post.title}
                </Typography>
                <div>
                  <AuthorCard
                    authorId={post.userId}
                    subText={format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                  />
                </div>
              </div>
              {/* <-------- POST CONTENT --------> */}
              <div
                className='p-4 text-gray-700 dark:text-gray-200 text-lg leading-relaxed'
                dangerouslySetInnerHTML={{
                  __html: post.content
                }}
              />
            </div>
            {/* <-------- RELATED POSTS --------> */}
            <PostsCard
              categories={post.categories}
              title={'Related Posts'}
              excludedPostId={post.id}
            />

            {/* <-------- COMMENT FORM --------> */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md'>
              <div className='p-4'>
                <Typography variant='h4' className='dark:text-gray-200'>
                  Leave a comment
                </Typography>
              </div>
              <div className='p-4'>
                {isAuthenticated ? (
                  <AuthenticatedUserCommentForm post={post} setPost={setPost} />
                ) : (
                  <UnauthenticatedUserCommentForm
                    post={post}
                    setPost={setPost}
                  />
                )}
              </div>
            </div>

            {/* <-------- POST COMMENTS --------> */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md'>
              <div className='p-4'>
                <Typography variant='h4' className='dark:text-gray-200 '>
                  Comments
                </Typography>
              </div>
              <div>
                {post.comments.map((commentId) => (
                  <CommentCard
                    key={commentId}
                    commentId={commentId}
                    isLast={
                      post.comments.indexOf(commentId) ===
                      post.comments.length - 1
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <DefaultSidebar />
        </div>
      </main>
      <DefaultFooter />
    </div>
  )
}
