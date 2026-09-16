import { useEffect, useRef } from "react"
import * as THREE from "three"

const FloatingPages = ({ count }) => {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    const width = window.innerWidth
    const height = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100)
    camera.position.set(0, 0, 10)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(width, height)
    mountRef.current.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)
    const light = new THREE.PointLight(0x9cb89a, 1.2, 0, 0)
    light.position.set(4, 3, 6)
    scene.add(light)

    const sheetCount = Math.min(Math.max(count, 3), 14)
    const sheets = []
    const geometry = new THREE.PlaneGeometry(1, 1.3)

    for (let i = 0; i < sheetCount; i++) {
      const material = new THREE.MeshStandardMaterial({
        color: 0xf3ede0,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        roughness: 0.9,
      })
      const sheet = new THREE.Mesh(geometry, material)
      sheet.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 2
      )
      sheet.rotation.set(Math.random() * 0.6 - 0.3, Math.random() * 0.6 - 0.3, Math.random() * 0.3 - 0.15)
      scene.add(sheet)
      sheets.push({ mesh: sheet, speed: 0.05 + Math.random() * 0.08, offset: Math.random() * 10 })
    }

    let animationId
    const clock = new THREE.Clock()
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      sheets.forEach(({ mesh, speed, offset }) => {
        mesh.position.y += Math.sin(elapsed * speed + offset) * 0.002
        mesh.rotation.z += 0.0006
      })

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })
      renderer.dispose()
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [count])

  return <div ref={mountRef} className="notes-scene-bg" />
}

export default FloatingPages