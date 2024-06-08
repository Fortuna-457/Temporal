import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography
} from '@material-tailwind/react'
import { Editor } from '@tinymce/tinymce-react'
import EditPostSidebar from '../Sidebars/EditPostSidebar'

export default function PostForm({
  post,
  setPost,
  handleSubmit,
  handleInputChange,
  title = 'Edit Post'
}) {
  const navigate = useNavigate()
  const editorRef = useRef(null)

  return (
    <form onSubmit={handleSubmit} className='flex items-start bg-gray-200'>
      <Card className='w-full ml-2 my-2'>
        <CardHeader
          floated={false}
          shadow={false}
          className='m-0 p-3 rounded-b-none bg-gray-300 flex justify-between items-center'
        >
          <Typography variant='h3'>{title}</Typography>
          <div className='flex gap-2'>
            <Button
              variant='outlined'
              onClick={() => navigate('/wt-content/posts')}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </CardHeader>
        <CardBody className='container mx-auto h-auto bg-white flex flex-col gap-5'>
          <Input
            variant='static'
            placeholder='Title'
            className='text-xl'
            name='title'
            labelProps={{
              className: 'before:content-none after:content-none'
            }}
            value={post.title}
            onChange={handleInputChange}
          />
          <Editor
            apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
            onInit={(evt, editor) => (editorRef.current = editor)}
            name='content'
            value={post.content}
            init={{
              height: 500,
              menubar: true,
              theme: 'silver',
              plugins: [
                'image',
                'code',
                'table',
                'link',
                'media',
                'codesample'
              ],
              // plugins: [
              //   'advlist autolink lists link image charmap print preview anchor',
              //   'visualblocks code fullscreen',
              //   'searchreplace insertdatetime media table paste code help wordcount'
              // ],
              toolbar:
                'undo redo | formatselect | styles |' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help'
            }}
            onEditorChange={(content) =>
              handleInputChange({
                target: {
                  name: 'content',
                  value: content
                }
              })
            }
          />
        </CardBody>
      </Card>
      <EditPostSidebar post={post} setPost={setPost} />
    </form>
  )
}
