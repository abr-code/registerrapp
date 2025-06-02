import { useState, useEffect } from 'react'
import type { Member } from './types/Member'
import { memberService } from './services/memberService'
import { SearchBar } from './components/SearchBar'
import { MemberList } from './components/MemberList'
import { MemberForm } from './components/MemberForm'
import { LoginForm } from './components/LoginForm'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { isAuthenticated, login, logout, user } = useAuth()

  useEffect(() => {
    loadMembers()
  }, [])

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
      setSelectedMember(null)
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

  const handleEdit = (member: Member) => {
    setSelectedMember(member)
    setShowForm(true)
  }

  return (
    <div className="app">
      {!isAuthenticated ? (
        <LoginForm 
          onSubmit={login}
          onError={(message) => {
            // Here you could add a toast notification system
            alert(message);
          }}
        />
      ) : (
        <>
          <header>
            <h1>Registro de Miembros</h1>
            <div className="header-actions">
              <button onClick={() => setShowForm(true)} className="add-button">
                Nuevo Registro
              </button>
              <div className="user-info">
                <span>{user?.email}</span>
                <button onClick={logout} className="logout-button">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </header>

          <main>
            {showForm ? (
              <MemberForm
                member={selectedMember || undefined}
                onSubmit={selectedMember ? handleUpdate : handleCreate}
                onCancel={() => {
                  setShowForm(false)
                  setSelectedMember(null)
                }}
              />
            ) : (
              <>
                <SearchBar onSearch={handleSearch} />
                <MemberList
                  members={members}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </>
            )}
          </main>
        </>
      )}
    </div>
  )
}

export default App
