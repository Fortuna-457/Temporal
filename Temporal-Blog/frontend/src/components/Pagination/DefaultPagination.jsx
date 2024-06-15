import { Button, IconButton } from '@material-tailwind/react'

export default function DefaultPagination({
  currentPage,
  totalPages,
  url,
  setUrl
}) {
  const handlePageChange = (page) => {
    setUrl({ ...url, page })
  }
  const renderPaginationButtons = () => {
    const buttons = []

    // Add the first page button
    buttons.push(
      <IconButton
        key={1}
        variant={currentPage === 1 ? 'outlined' : 'text'}
        size='sm'
        onClick={() => handlePageChange(1)}
        className='dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
        disabled={currentPage === 1}
      >
        1
      </IconButton>
    )

    // Add the ellipsis button if there are more than 5 pages
    if (totalPages > 5) {
      buttons.push(
        <IconButton key='ellipsis-start' variant='text' size='sm' disabled>
          ...
        </IconButton>
      )
    }

    // Add the middle page buttons (if applicable)
    const middlePages = []
    let startPage, endPage

    if (totalPages <= 5) {
      // If there are 5 or fewer pages, show all page buttons
      startPage = 2
      endPage = totalPages - 1
    } else {
      // If there are more than 5 pages
      if (currentPage <= 3) {
        // If the current page is in the first 3 pages
        startPage = 2
        endPage = 4
      } else if (currentPage >= totalPages - 2) {
        // If the current page is in the last 3 pages
        startPage = totalPages - 3
        endPage = totalPages - 1
      } else {
        // If the current page is in the middle
        startPage = currentPage - 1
        endPage = currentPage + 1
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      if (page !== 1 && page !== totalPages) {
        middlePages.push(
          <IconButton
            key={page}
            variant={currentPage === page ? 'outlined' : 'text'}
            size='sm'
            onClick={() => handlePageChange(page)}
            className='dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
            disabled={currentPage === page}
          >
            {page}
          </IconButton>
        )
      }
    }

    buttons.push(...middlePages)

    // Add the ellipsis button if there are more than 5 pages
    if (totalPages > 5) {
      buttons.push(
        <IconButton key='ellipsis-end' variant='text' size='sm' disabled>
          ...
        </IconButton>
      )
    }

    // Add the last page button
    if (totalPages > 1) {
      buttons.push(
        <IconButton
          key={totalPages}
          variant={currentPage === totalPages ? 'outlined' : 'text'}
          size='sm'
          onClick={() => handlePageChange(totalPages)}
          className='dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </IconButton>
      )
    }
    return buttons
  }

  return (
    <>
      <Button
        variant='outlined'
        size='sm'
        disabled={currentPage === 1}
        className='dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <div className='flex items-center gap-2'>{renderPaginationButtons()}</div>
      <Button
        variant='outlined'
        size='sm'
        disabled={currentPage === totalPages}
        className='dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </Button>
    </>
  )
}
