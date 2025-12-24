import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'

function About() {
  const [isMenuActive, setIsMenuActive] = useState(() => {
    return sessionStorage.getItem('pageTransition') === 'true'
  })
  const [isPageTransition, setIsPageTransition] = useState(() => {
    return sessionStorage.getItem('pageTransition') === 'true'
  })
  const [isReturning, setIsReturning] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive)
  }

  // Check for page transition
  useEffect(() => {
    const isTransitioning = sessionStorage.getItem('pageTransition')
    if (isTransitioning === 'true') {
      sessionStorage.removeItem('pageTransition')
      
      // Hold at full screen for a short delay (already at full screen from initial state)
      setTimeout(() => {
        // Return to original shape
        setIsPageTransition(false)
        setIsReturning(true)
        
        // Short delay after returning to original shape
        setTimeout(() => {
          // Close menu (return to button)
          setIsReturning(false)
          setIsMenuActive(false)
        }, 900)
      }, 800)
    }
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const isDesktop = window.innerWidth >= 768
    const isInternal = href.startsWith('/')
    if (isDesktop) {
      setIsPageTransition(true)
      sessionStorage.setItem('pageTransition', 'true')
      setTimeout(() => {
        if (href.startsWith('http')) {
          window.open(href, '_blank')
          sessionStorage.removeItem('pageTransition')
        } else if (href.startsWith('#')) {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
          sessionStorage.removeItem('pageTransition')
          setIsPageTransition(false)
          setIsMenuActive(false)
        } else if (isInternal) {
          navigate(href)
          return
        } else {
          window.location.href = href
        }
      }, 800)
    } else {
      setIsMenuActive(false)
      if (href.startsWith('http')) {
        window.open(href, '_blank')
      } else if (href.startsWith('#')) {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      } else if (isInternal) {
        navigate(href)
        return
      } else {
        window.location.href = href
      }
    }
  }

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Folder hover animation
  useEffect(() => {
    const folders = document.querySelectorAll('.folders .folder')
    const folderWrappers = document.querySelectorAll('.folders .folder-wrapper')

    if (folders.length === 0) return

    let isMobile = window.innerWidth < 1000

    function setInitialPositions() {
      gsap.set(folderWrappers, { y: isMobile ? 0 : 25 })
    }

    setInitialPositions()

    folders.forEach((folder, index) => {
      const previewImages = folder.querySelectorAll('.folder-preview-img')

      // Handle folder click for links
      folder.addEventListener('click', () => {
        const link = folder.getAttribute('data-link')
        const mailto = folder.getAttribute('data-mailto')
        const pdf = folder.getAttribute('data-pdf')
        
        if (link) {
          if (link.startsWith('http')) {
            window.open(link, '_blank')
          } else {
            window.location.href = link
          }
        } else if (mailto) {
          window.location.href = `mailto:${mailto}`
        } else if (pdf) {
          window.open(pdf, '_blank')
        }
      })

      folder.addEventListener('mouseenter', () => {
        if (isMobile) return
        
        folders.forEach((siblingFolder) => {
          if (siblingFolder !== folder) {
            siblingFolder.classList.add('disabled')
          }
        })
        
        gsap.to(folderWrappers[index], {
          y: 0,
          duration: 0.25,
          ease: 'back.out(1.7)'
        })
     
        previewImages.forEach((img, imgIndex) => {
          let rotation
          if (imgIndex === 0) {
            rotation = gsap.utils.random(-20, -10)
          } else if (imgIndex === 1) {
            rotation = gsap.utils.random(-10, 10)
          } else {
            rotation = gsap.utils.random(10, 20)
          }

          gsap.to(img, {
            y: '-100%',
            rotation: rotation,
            duration: 0.25,
            ease: 'back.out(1.7)',
            delay: imgIndex * 0.025,
          })
        })
      })
       
      folder.addEventListener('mouseleave', () => {
        if (isMobile) return

        folders.forEach((siblingFolder) => {
          siblingFolder.classList.remove('disabled')
        })
       
        gsap.to(folderWrappers[index], {
          y: 25,
          duration: 0.25,
          ease: 'back.out(1.7)'
        })

        previewImages.forEach((img, imgIndex) => {
          gsap.to(img, {
            y: '0%',
            rotation: 0,
            duration: 0.25,
            ease: 'back.out(1.7)',
            delay: imgIndex * 0.05,
          })
        })
      })
    })

    const handleResize = () => {
      const currentBreakpoint = window.innerWidth < 1000
      if (currentBreakpoint !== isMobile) {
        isMobile = currentBreakpoint
        setInitialPositions()
      }

      folders.forEach((folder) => {
        folder.classList.remove('disabled')
      })

      const allPreviewImages = document.querySelectorAll('.folder-preview-img')
      gsap.set(allPreviewImages, { y: '0%', rotation: 0 })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      {/* Navigation Header */}
      <header className="nav-header">
        <div className="nav-header-content">
          <button 
            className="nav-menu-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMenuActive ? 'Close.' : 'Menu.'}
          </button>
        </div>
      </header>

      {/* Spotlight Menu Overlay */}
      <nav className={`nav-spotlight-menu ${isMenuActive ? 'active' : ''} ${isPageTransition ? 'page-transition' : ''} ${isReturning ? 'returning' : ''}`}>
        <div className="nav-spotlight-background"></div>
        <div className="nav-spotlight-links">
          <a href="/" onClick={(e) => handleLinkClick(e, '/')}>Home.</a>
          <a href="/about" onClick={(e) => handleLinkClick(e, '/about')}>About.</a>
          <a href="/work" onClick={(e) => handleLinkClick(e, '/work')}>Work.</a>
          <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>Contact&#10174;</a>
        </div>
      </nav>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-image">
            <img src="/mirko3.jpeg" alt="Mirko" />
          </div>
          <div className="about-title">
            <h1><span className='serif'>a</span>bout.</h1>
          </div>
          <div className="about-text">
            <p>I'm a <span className='colored-background-variant-2'> cook </span> turned <span className='colored-background-variant-1'>web developer</span> based in Serbia 🇷🇸. I studied at the University of Novi Sad <img src="/ns.svg" alt="" style={{display: 'inline', width: '30px', height: '30px', marginLeft: '4px', marginRight: '2px', verticalAlign: 'middle'}} /> where I earned my BSc in <span className='serif'> Software Engineering</span>. I love creating websites that look nice while still being efficient and clean in perfomance. I'm passionate about everything JavaScript<img src="/javascript-logo-svgrepo-com.svg" alt="" style={{display: 'inline', width: '30px', height: '30px', marginLeft: '4px', marginRight: '4px', verticalAlign: 'middle'}} />, but I also
                sometimes dabble in back-end primarily using PHP frameworks<img src="/laravel-svgrepo-com.svg" alt="" style={{display: 'inline', width: '30px', height: '30px', marginLeft: '4px', marginRight: '2px', verticalAlign: 'middle'}} /><img src="/symfony-svgrepo-com.svg" alt="" style={{display: 'inline', width: '30px', height: '30px', marginRight: '4px', verticalAlign: 'middle'}} /> and Node.js<img src="/node-js-svgrepo-com.svg" alt="" style={{display: 'inline', width: '30px', height: '30px', marginLeft: '4px', marginRight: '4px', verticalAlign: 'middle'}} />.
            </p>
          </div>
        </div>
      </section>

      {/* Footer with Folders */}
      <div className="folders">
        <h2 style={{ marginLeft: '3rem', marginTop: '1rem' }}><span className="colored-background-variant-1">Everything</span> you need to know about <span className="serif">Mirko</span>, tidily packed.</h2>
        <div className="row">
          <div className="folder variant-1" data-link="/work">
            <div className="folder-preview">
              <div className="folder-preview-img"><img src="/gridSistemi.jpg" alt="Grid Systems" /></div>
              <div className="folder-preview-img"><img src="/poster7.jpg" alt="Poster 7" /></div>  
              <div className="folder-preview-img"><img src="/poster8.jpg" alt="Poster 8" /></div>    
            </div>
            <div className="folder-wrapper">
              <div className="folder-index"><p>01</p></div>
              <div className="folder-name"><h1>Work</h1></div>
            </div>
          </div>
          <div className="folder variant-2" data-link="https://github.com/m3Mza">
            <div className="folder-preview">
              <div className="folder-preview-img"><img src="/gitDark.svg" alt="GitHub Dark" /></div>
              <div className="folder-preview-img"><img src="/gitLight.svg" alt="GitHub Light" /></div>  
              <div className="folder-preview-img"><img src="/gitDark.svg" alt="GitHub Dark" /></div>    
            </div>
            <div className="folder-wrapper">
              <div className="folder-index"><p>02</p></div>
              <div className="folder-name"><h1>GitHub</h1></div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="folder variant-2" data-link="/about">
            <div className="folder-preview">
              <div className="folder-preview-img"><img src="/mirko1.jpeg" alt="Resume 1" /></div>
              <div className="folder-preview-img"><img src="/mirko2.jpeg" alt="Resume 2" /></div>  
              <div className="folder-preview-img"><img src="/mirko3.jpeg" alt="Resume 3" /></div>    
            </div>
            <div className="folder-wrapper">
              <div className="folder-index"><p>03</p></div>
              <div className="folder-name"><h1>About</h1></div>
            </div>
          </div>
          <div className="folder variant-3" data-mailto="mirkomimap@gmail.com">
            <div className="folder-preview">
              <div className="folder-preview-img"></div>
              <div className="folder-preview-img"></div>  
              <div className="folder-preview-img"></div>    
            </div>
            <div className="folder-wrapper">
              <div className="folder-index"><p>04</p></div>
              <div className="folder-name"><h1>Contact &#10174;</h1></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
