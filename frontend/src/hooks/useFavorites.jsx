import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sustainable-favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const addFavorite = (design) => {
    const updated = [...favorites, { ...design, savedAt: new Date().toISOString() }]
    setFavorites(updated)
    localStorage.setItem('sustainable-favorites', JSON.stringify(updated))
  }

  const removeFavorite = (designId) => {
    const updated = favorites.filter(f => f.id !== designId)
    setFavorites(updated)
    localStorage.setItem('sustainable-favorites', JSON.stringify(updated))
  }

  const isFavorited = (designId) => {
    return favorites.some(f => f.id === designId)
  }

  return { favorites, addFavorite, removeFavorite, isFavorited }
}

export default Favorites
