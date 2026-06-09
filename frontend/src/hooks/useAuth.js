import { useState, useEffect } from 'react'
import { getMyProfile } from '../services/api'

export default function useAuth() {
    const [user, setUser] = useState(undefined) // undefined = still checking
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyProfile()
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    return { user, loading }
}