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
        let delay = Math.floor(Math.random() * 200) + 50;

        setTimeout(updateCounter, delay);
    }
    updateCounter();
}
startLoader() 
gsap.to('.counter',0.25, {
    delay: 3.5,
    opacity: 0,
})

gsap.to('.bar', 1.5, {
    delay: 3.5,
    width: 0,
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
// Objects
loader.load('umbrella.glb', (gltf) => {

    star = gltf.scene
    scene.add(star)
    //mediaMatch
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    mediaQuery.addListener(handleMediaQueryChange)
    handleMediaQueryChange(mediaQuery)


    function handleMediaQueryChange(event) {
        if (event.matches) {
            //mobile        
            if (isScroll) {
                star.position.set(0, -0.7, 0)
                star.scale.set(1.2, 1.2, 1.2)
            } else {
                star.position.set(0, -1.4, -1)
                star.scale.set(.5, .5, .5)
            }

        } else {
            //desktop
            if (isScroll) {
                star.position.set(0, -0.7, 0)
                star.scale.set(1.2, 1.2, 1.2)
            } else {
                star.position.set(0, -1.9, -1)
                star.scale.set(.8, .8, .8)
            }

        }
    }

    //roughness
    star.children[0].material.roughness = .5;

    // const starFolder = gui.addFolder('Star')
    // starFolder.add(star.position, 'x').min(-5).max(5).step(0.1).name('position.x')
    // starFolder.add(star.position, 'y').min(-5).max(5).step(0.1).name('position.y')
    // starFolder.add(star.position, 'z').min(-5).max(5).step(0.1).name('position.z')

    // starFolder.add(star.rotation, 'x').min(-5).max(5).step(0.1).name('rotation.x')
    // starFolder.add(star.rotation, 'y').min(-5).max(5).step(0.1).name('rotation.y')
    // starFolder.add(star.rotation, 'z').min(-5).max(5).step(0.1).name('rotation.z')


    const tl = gsap.timeline({

        scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: 'bottom center',
            scrub: 2,
            pin: true,
            toggleActions: 'play none none reverse',
            onEnter: () => {

                isScroll = true
                console.log(isScroll)

            },
            onLeaveBack: () => {

                isScroll = false
                console.log(isScroll)

            },
            // markers: true,
        }
    })
    tl.to(pointLight.position, { x: 2, y: -2, z: 3 })
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
})

//text 







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
