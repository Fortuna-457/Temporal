import React, { useRef } from 'react'
import DefaultNavbar from '../../components/Navbar/DefaultNavbar'
import heroImage from '../../assets/img/bgHero.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Typography, Input, Button, IconButton } from '@material-tailwind/react'
import { DefaultFooter } from '../../components/Footer/DefaultFooter'
import {
  faTwitter,
  faFacebook,
  faGithub
} from '@fortawesome/free-brands-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import PostsCard from '../../components/Cards/Single/PostsCard'
import {
  ArrowPathRoundedSquareIcon,
  ArrowsUpDownIcon,
  BoltIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FingerPrintIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const sectionRef = useRef(null)
  return (
    <main className='bg-gray-200 dark:bg-gray-900'>
      <DefaultNavbar />
      <div
        className='h-screen w-full bg-cover bg-center bg-no-repeat relative z-0'
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            content: '',
            zIndex: 1
          }}
        />
        <div className='h-full text-white z-40 relative flex'>
          <div className='container px-3 mx-auto my-10 flex flex-wrap flex-col md:flex-row items-center'>
            <div className='flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left'>
              <p className='uppercase tracking-loose w-full'>
                Do you want to go on a historical journey?
              </p>
              <h1 className='my-4 text-5xl font-bold leading-tight'>
                Temporal Trek has arrived!
              </h1>
              <p className='leading-normal text-2xl mb-8'>
                Immerse yourself in a game where you can enjoy and learn at the
                same time.
              </p>
              <button
                className='mx-auto lg:mx-0 bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg hover:bg-gray-900 hover:text-white'
                onClick={() =>
                  sectionRef.current.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Play now
              </button>
            </div>
          </div>
        </div>
      </div>

      <section
        ref={sectionRef}
        className='container mx-auto px-6 py-16 text-center'
      >
        <div className='mx-auto max-w-lg'>
          <Typography variant='h1' className='text-gray-800 dark:text-white'>
            Welcome to this journey
          </Typography>
          <p className='mt-6 text-gray-500 dark:text-gray-300'>
            We are thrilled to welcome you to MapMaster Adventures, your
            ultimate destination for thrilling map-based games and geographic
            challenges!
          </p>
          <p className='mt-3 text-sm text-gray-400'>No credit card required</p>
        </div>
      </section>

      <section className='relative '>
        <div className='relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75'>
          <div
            className='absolute top-0 w-full h-full bg-center bg-cover'
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80")'
            }}
          >
            <span
              id='blackOverlay'
              className='w-full h-full absolute opacity-75 bg-black'
            />
          </div>
          <div className='container relative mx-auto'>
            <div className='items-center flex flex-wrap'>
              <div className='w-full lg:w-6/12 px-4 ml-auto mr-auto text-center'>
                <div className='pr-12'>
                  <h1 className='text-white font-semibold text-5xl'>
                    What to Expect
                  </h1>
                  <p className='mt-4 text-lg text-gray-200'>
                    Put your geographic knowledge to the test with our diverse
                    range of map-based challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className='pb-10 -mt-24'>
          <div className='container mx-auto px-4'>
            <div className='flex flex-wrap'>
              <div className='lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center'>
                <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg'>
                  <div className='px-4 py-5 flex-auto'>
                    <div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400'>
                      <BoltIcon />
                    </div>
                    <h6 className='text-xl font-semibold'>
                      Engaging Challenges
                    </h6>
                    <p className='mt-2 mb-4 text-blueGray-500'>
                      Stay tuned for regular updates, new features, and special
                      events that will keep the adventure fresh and exciting.
                    </p>
                  </div>
                </div>
              </div>
              <div className='w-full md:w-4/12 px-4 text-center'>
                <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg'>
                  <div className='px-4 py-5 flex-auto'>
                    <div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400'>
                      <ChatBubbleLeftEllipsisIcon />
                    </div>
                    <h6 className='text-xl font-semibold'>
                      Community Connection
                    </h6>
                    <p className='mt-2 mb-4 text-blueGray-500'>
                      Join a community of fellow explorers. Share your high
                      scores, discuss strategies, and connect with others who
                      share your passion for geography.
                    </p>
                  </div>
                </div>
              </div>
              <div className='pt-6 w-full md:w-4/12 px-4 text-center'>
                <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg'>
                  <div className='px-4 py-5 flex-auto'>
                    <div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400'>
                      <QuestionMarkCircleIcon />
                    </div>
                    <h6 className='text-xl font-semibold'>Tips & Tricks</h6>
                    <p className='mt-2 mb-4 text-blueGray-500'>
                      Check out our blog for helpful tips and strategies to
                      improve your gameplay and master the art of location
                      guessing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section>
        <div className='h-[32rem] bg-gray-100 dark:bg-gray-800'>
          <div className='container mx-auto px-6 py-10'>
            <h1 className='text-center text-3xl font-semibold capitalize text-gray-800 dark:text-white lg:text-4xl'>
              The Executive Team
            </h1>
            <div className='mx-auto mt-6 flex justify-center'>
              <span className='inline-block h-1 w-40 rounded-full bg-gray-700 dark:bg-gray-200' />
              <span className='mx-1 inline-block h-1 w-3 rounded-full bg-gray-700 dark:bg-gray-200' />
              <span className='inline-block h-1 w-1 rounded-full bg-gray-700 dark:bg-gray-200' />
            </div>
            <p className='mx-auto mt-6 max-w-2xl text-center text-gray-500 dark:text-gray-300'>
              From visionary leadership to creative talent, and technical
              wizards, each team member plays a pivotal role in delivering the
              exceptional service and innovative solutions.
            </p>
          </div>
        </div>
        <div className='container mx-auto -mt-72 px-6 py-10 sm:-mt-80 md:-mt-96'>
          <div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:mt-16 xl:grid-cols-3'>
            <div className='flex flex-col items-center rounded-xl p-4 sm:p-6'>
              <img
                className='aspect-square w-full rounded-xl object-cover'
                src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
                alt=''
              />
              <h1 className='mt-4 text-2xl font-semibold capitalize text-gray-700 dark:text-white'>
                Tristan Alonso
              </h1>
              <p className='mt-2 capitalize text-gray-500 dark:text-gray-300'>
                Full Stack developer
              </p>
              <div className='-mx-2 mt-3 flex'>
                <Link
                  to={'#'}
                  className='mx-2 text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-600'
                  aria-label='Twitter'
                >
                  <FontAwesomeIcon icon={faTwitter} className='text-lg' />
                </Link>
                <Link
                  to={'#'}
                  className='mx-2 text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-600'
                  aria-label='Facebook'
                >
                  <FontAwesomeIcon icon={faFacebook} className='text-lg' />
                </Link>
                <Link
                  to={'#'}
                  className='mx-2 text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-600'
                  aria-label='Github'
                >
                  <FontAwesomeIcon icon={faGithub} className='text-lg' />
                </Link>
              </div>
            </div>
            <div className='flex flex-col items-center rounded-xl p-4 sm:p-6'>
              <img
                className='aspect-square w-full rounded-xl object-cover'
                src='https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'
                alt=''
              />
              <h1 className='mt-4 text-2xl font-semibold capitalize text-gray-700 dark:text-white'>
                Sofia Khudomyasova
              </h1>
              <p className='mt-2 capitalize text-gray-500 dark:text-gray-300'>
                Lead Developer
              </p>
              <div className='-mx-2 mt-3 flex'>
                <Link
                  to={'#'}
                  className='mx-2 text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-600'
                  aria-label='Twitter'
                >
                  <FontAwesomeIcon icon={faTwitter} className='text-lg' />
                </Link>
                <Link
                  to={'#'}
                  className='mx-2 text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-600'
                  aria-label='Facebook'
                >
                  <FontAwesomeIcon icon={faFacebook} className='text-lg' />
                </Link>
                <Link
                  to={'#'}
                  className='mx-2 text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-600'
                  aria-label='Github'
                >
                  <FontAwesomeIcon icon={faGithub} className='text-lg' />
                </Link>
              </div>
            </div>
            <div className='flex flex-col items-center rounded-xl p-4 sm:p-6'>
              <img
                className='aspect-square w-full rounded-xl object-cover'
                src='https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
                alt=''
              />
              <h1 className='mt-4 text-2xl font-semibold capitalize text-gray-700 dark:text-white'>
                Alejandro Castro
              </h1>
              <p className='mt-2 capitalize text-gray-500 dark:text-gray-300'>
                Full stack developer
              </p>
              <div className='-mx-2 mt-3 flex'>
                <Link
                  to={'#'}
                  className='mx-2 text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-600'
                  aria-label='Twitter'
                >
                  <FontAwesomeIcon icon={faTwitter} className='text-lg' />
                </Link>
                <Link
                  to={'#'}
                  className='mx-2 text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-600'
                  aria-label='Facebook'
                >
                  <FontAwesomeIcon icon={faFacebook} className='text-lg' />
                </Link>
                <Link
                  to={'#'}
                  className='mx-2 text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-600'
                  aria-label='Github'
                >
                  <FontAwesomeIcon icon={faGithub} className='text-lg' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className='container mx-auto px-6 py-10'>
          <h1 className='text-center text-3xl font-semibold capitalize text-gray-800 dark:text-white lg:text-4xl'>
            What users saying
          </h1>
          <div className='mx-auto mt-6 flex justify-center'>
            <span className='inline-block h-1 w-40 rounded-full bg-gray-700 dark:bg-gray-200' />
            <span className='mx-1 inline-block h-1 w-3 rounded-full bg-gray-700 dark:bg-gray-200' />
            <span className='inline-block h-1 w-1 rounded-full bg-gray-700 dark:bg-gray-200' />
          </div>
          <div className='mx-auto mt-16 flex max-w-6xl items-start'>
            <IconButton
              variant='text'
              className='hidden rounded-full p-6 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 lg:block'
            >
              <ChevronLeftIcon width={24} />
            </IconButton>
            <div>
              <p className='flex items-center text-center text-gray-500 lg:mx-8'>
                What I love most is how immersive and educational the game is.
                It's not just about guessing locations; it's about exploring the
                world from my living room. MapMaster Adventures has rekindled my
                love for geography in a fun and interactive way. I highly
                recommend it to anyone looking to challenge their knowledge and
                embark on a virtual journey across the globe!
              </p>
              <div className='mt-8 flex flex-col items-center justify-center'>
                <img
                  className='h-14 w-14 rounded-full object-cover'
                  src='https://images.unsplash.com/photo-1499470932971-a90681ce8530?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
                  alt=''
                />
                <div className='mt-4 text-center'>
                  <h1 className='font-semibold text-gray-800 dark:text-white'>
                    Mia Brown
                  </h1>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    Marketer
                  </span>
                </div>
              </div>
            </div>
            <IconButton
              variant='text'
              className='hidden rounded-full p-6 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 lg:block'
            >
              <ChevronRightIcon width={24} />
            </IconButton>
          </div>
        </div>
      </section>

      <section>
        <div className='container mx-auto px-6 py-10'>
          <div className='text-center mb-10'>
            <h1 className='text-3xl font-semibold capitalize text-gray-800 dark:text-white lg:text-4xl'>
              From the blog
            </h1>

            <p className='mx-auto mt-4 max-w-lg text-gray-500'>
              Explore our blog section for the latest updates, gameplay tips,
              and fascinating geographic insights.
            </p>
          </div>
          <PostsCard />
        </div>
      </section>

      <DefaultFooter />
    </main>
  )
}
