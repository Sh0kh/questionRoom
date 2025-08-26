import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ReactLoading from 'react-loading';


export default function AdminTestView() {
    const { ID } = useParams()
    const [loading, setLoading] = useState(true)

    const getTest = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`/test/get/by/id`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }, params: {
                    id: ID
                }
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTest()
    }, [])

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }

    return (
        <>

        </>
    )
}