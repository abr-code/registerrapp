import { useState, useEffect } from 'react'
import type { Member } from './types/Member'
import { memberService } from './services/memberService'
import { SearchBar } from './components/SearchBar'
import { MemberList } from './components/MemberList'
import { MemberForm } from './components/MemberForm'
import { LoginForm } from './components/LoginForm'
import { ExportImport } from './components/ExportImport'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)
  const { isAuthenticated, login, register, logout, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      loadMembers()
    }
  }, [isAuthenticated])

  const loadMembers = async () => {
    const data = await memberService.getAll()
    setMembers(data)
  }

  const handleSearch = async (query: string, field?: keyof Member) => {
    const results = await memberService.search(query, field)
    setMembers(results)
  }

  const handleCreate = async (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    await memberService.create(member)
    setShowForm(false)
    loadMembers()
  }

  const handleUpdate = async (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedMember) {
      await memberService.update(selectedMember.id, member)
      setSelectedMember(undefined)
      setShowForm(false)
      loadMembers()
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro?')) {
      await memberService.delete(id)
      loadMembers()
    }
  }

  const handleImportComplete = () => {
    loadMembers()
  }

  const handleImportError = (message: string) => {
    alert(message)
  }

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <LoginForm 
          onSubmit={login}
          onRegister={register}
          onError={handleImportError}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <header>
        <h1>Registro de Miembros</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={logout} className="logout-button">Cerrar sesión</button>
        </div>
      </header>
      <main>
        <div className="controls">
          <SearchBar onSearch={handleSearch} />
          <ExportImport 
            onImportComplete={handleImportComplete}
            onError={handleImportError}
          />
          <button onClick={() => setShowForm(true)} className="add-button">
            Agregar Miembro
          </button>
        </div>
        <MemberList 
          members={members} 
          onEdit={(member) => {
            setSelectedMember(member)
            setShowForm(true)
          }} 
          onDelete={handleDelete}
        />
      </main>
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <MemberForm
              member={selectedMember}
              onSubmit={selectedMember ? handleUpdate : handleCreate}
              onCancel={() => {
                setSelectedMember(undefined)
                setShowForm(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
