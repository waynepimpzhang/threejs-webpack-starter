import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import SplitType from 'split-type'

//preloader
function startLoader() {
    let counterElement = document.querySelector('.counter');
    let currentValue = 0;
    function updateCounter() {
        if (currentValue === 100) {
            return;
        }

        currentValue += Math.floor(Math.random() * 10) + 1;
        if (currentValue > 100) {
            currentValue = 100;
        }
        counterElement.textContent = currentValue;
        let delay = Math.floor(Math.random() * 100);

        setTimeout(updateCounter, delay);
    }
    updateCounter();
}
startLoader()
// onComplete
gsap.to('.counter', 0.25, {
    delay: 1.5,
    opacity: 0,
    onComplete: gsapComplete
})

gsap.to('.bar', 1.5, {
    delay: 1.5,
    height: 0,
    stagger: 0.1,
    ease: 'power4.inOut',
})


//gltf loader
const loader = new GLTFLoader();
//draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

// Scroll Trigger
gsap.registerPlugin(ScrollTrigger);

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
let star = null
const axesHelper = new THREE.AxesHelper(5);
let isScroll = false
const wrapper = document.querySelector('.wrapper')
const mediaQuery = window.matchMedia('(max-width: 768px)')
const border = document.querySelector('.border')
const h1Text = new SplitType('.wrapper h1')
const h2Text = new SplitType('.wrapper h2')

// Objects
loader.load('umbrella.glb', (gltf) => {
// loader.load('box.glb', (gltf) => {
    star = gltf.scene
    scene.add(star)
    //mediaMatch
    mediaQuery.addListener(handleMediaQueryChange)
    handleMediaQueryChange(mediaQuery)

    function handleMediaQueryChange(event) {
        if (event.matches) {
            //mobile        
            star.position.set(0, -1.4, 0)
            star.scale.set(.5, .5, .5)
            gsap.to('.border', {
                border: '3vw solid rgb(255, 255, 255)',
                duration: 1,
                ease: 'power2.Out'
            })
        } else {
            //desktop
            star.position.set(0, -1.9, 0)
            star.scale.set(.8, .8, .8)
            gsap.to('.border', {
                border: '8vw solid rgb(255, 255, 255)',
                duration: 1,
                ease: 'power2.Out'
            })
        }
        // console.log(event.matches)
        // console.log(star.position.x, star.position.y, star.position.z, star.scale.x, star.scale.y, star.scale.z)
        // console.log(camera.position.x, camera.position.y, camera.position.z)  
    }
    //roughness
    star.children[0].material.roughness = .5;
    //metalness
    star.children[0].material.metalness = 0;

    // const starFolder = gui.addFolder('Star')
    // starFolder.add(star.position, 'x').min(-5).max(5).step(0.1).name('position.x')
    // starFolder.add(star.position, 'y').min(-5).max(5).step(0.1).name('position.y')
    // starFolder.add(star.position, 'z').min(-5).max(5).step(0.1).name('position.z')

    // starFolder.add(star.rotation, 'x').min(-5).max(5).step(0.1).name('rotation.x')
    // starFolder.add(star.rotation, 'y').min(-5).max(5).step(0.1).name('rotation.y')
    // starFolder.add(star.rotation, 'z').min(-5).max(5).step(0.1).name('rotation.z')

    const tl = gsap.timeline({
        defaults: {
            duration: 1,
            ease: "sine.inOut",
            onComplete: () => {

            }
        },
        scrollTrigger: {
            trigger: wrapper,
            start: 'top 35%',
            end: 'bottom 80%',
            pin: true,
            toggleActions: 'play none none reverse',
            //  markers: true,
        }
    })
    tl.to(h1Text.chars, {
        duration: 1,
        opacity: 0,
        y: -100,
        stagger: 0.1,
    })
    tl.to(h2Text.chars, {
        duration: 1,
        opacity: 0,
        y: -100,
        stagger: 0.1,
    }, '<')
    tl.to(pointLight.position, { x: 2, y: -2, z: 3 }, '-=1')
    tl.to(star.position, {
        z: 0,
        y: -.07
    }, '<')
    tl.to(star.rotation, {
        x: 1.5,
    }, '<')
    tl.to(star.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2
    }, '<')

    tl.to('.border', {
        border: '0'
    }, '<')
})
const tl2 = gsap.timeline({
    defaults: {
        ease: 'power2.Out',
        duration: 1
    },
    scrollTrigger: {
        trigger: '.black',
        start: 'top center',
        end: 'bottom top',
        toggleActions: 'play reverse play reverse',
        // markers: true,
    }

})
// const boxs = gsap.utils.toArray('.box')
// boxs.forEach((box) => {
//     tl2.from(box, {
//         y: 50,
//         opacity: 0,
//     })
// })
const boxh1 = new SplitType('.box h1')
const boxp = new SplitType('.box p')
// console.log(boxh1, boxp)
// text animation

tl2.from(boxh1.lines, {
    duration: 1,
    opacity: 0,
    y: 10,
    stagger: 0.1,
})
tl2.from(boxp.lines, {
    duration: 1,
    opacity: 0,
    y: 10,
    stagger: 0.1,
})

function gsapComplete() {
    if (star) {
       // gsap.fromTo(star.position, { z: 10 ,duration: 2, ease: 'power2.Out'  }, { z: -1,duration: 2 , ease: 'power2.Out' })
        gsap.from(h1Text.chars, {
            duration: 1,
            delay: .9,
            opacity: 0,
            y: 100,
            stagger: 0.05,
            ease: 'power2.Out',
        })
        gsap.from(h2Text.chars, {
            duration: 1,
            delay: 1,
            opacity: 0,
            y: 100,
            stagger: 0.05,
            ease: 'power2.Out',
        })
    }
}







// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 3)
pointLight.position.x = 1
pointLight.position.y = 3
pointLight.position.z = 0
scene.add(pointLight)
// pointLight.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

let baseY = .5;
let amplitude = 1;
let frequency = 1;

const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update objects

    pointLight.position.y = baseY + amplitude * Math.sin(frequency * elapsedTime)
    // Update Orbital Controls
    // controls.update()
    if (star) {
        star.rotation.y += 0.005;
    }
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



//lenis 

const lenis = new Lenis()
lenis.on('scroll', (event) => {

})
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)


//mouse move effect camera position x and y
//mobile touches effect camera position x and y



const mouse = { x: 0, y: 0 }
window.addEventListener('mousemove', (event) => {
    mouse.x = -(event.clientX / window.innerWidth) * 2 + 1
    mouse.y = (event.clientY / window.innerHeight) * 2 - 1
    camera.position.x += (mouse.x - camera.position.x) * 0.05
    camera.position.y += (mouse.y - camera.position.y) * 0.05
    camera.lookAt(scene.position)
    // console.log(event.clientX, event.clientY)
})


