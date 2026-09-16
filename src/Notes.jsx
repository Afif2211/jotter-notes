// Notes.jsx
import { useEffect, useState } from "react"
import FloatingPages from "./FloatingPages"
import "./Notes.css"

const Notes = () => {
    const [input, setInput] = useState("")
    const [notes, setNotes] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    const inputChange = (e) => {
        setInput(e.target.value)
    }

    const addNotes = () => {
        if (!input.trim()) return
        setNotes([...notes, input])
        setInput("")
    }

    const deleteNote = (index) => {
        setNotes(notes.filter((item, i) => i != index))
    }

    useEffect(() => {
        const response = localStorage.getItem("notes")
        if (response === null) {
            setNotes([])
            setIsLoaded(true)
            return
        }
        const result = JSON.parse(response)
        setNotes(result)
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded === false) {
            return
        }
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes, isLoaded])

    return (
        <div className="notes-app">
            <FloatingPages count={notes.length} />

            <p className="notes-brand">Built by <strong>Afif Ahmad</strong></p>

            <div className="notes-card">
                <p className="notes-app-name">Jotter</p>
                <h1>Your notes</h1>

                <div className="notes-form">
                    <input
                        value={input}
                        onChange={inputChange}
                        type="text"
                        placeholder="Write a note..."
                        onKeyDown={(e) => e.key === "Enter" && addNotes()}
                    />
                    <button onClick={addNotes}>Add</button>
                </div>

                <div className="notes-list">
                    {notes.length === 0 && (
                        <p className="notes-empty">No notes yet — write your first one above.</p>
                    )}

                    {notes.map((item, index) => (
                        <div className="notes-item" key={index}>
                            <p>{item}</p>
                            <button onClick={() => deleteNote(index)} aria-label="Delete note">×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="notes-about">
                <p>
                    Notes here persist across page reloads using the browser's{" "}
                    <code>localStorage</code> API. On mount, one <code>useEffect</code> reads
                    any saved notes and restores them into state; a second <code>useEffect</code>{" "}
                    writes the notes array back to <code>localStorage</code> whenever it changes.
                    An <code>isLoaded</code> flag prevents a race condition where the save effect
                    could fire with an empty array before the load effect finishes, which would
                    silently wipe out saved notes on every refresh. The background scene uses
                    Three.js to drift a handful of translucent page shapes, roughly scaled to how
                    many notes currently exist.
                </p>
            </div>

            <div className="notes-footer">
                <span className="notes-tech-badge">React</span>
                <span className="notes-tech-badge">localStorage</span>
                <span className="notes-tech-badge">Three.js</span>
            </div>
        </div>
    )
}

export default Notes