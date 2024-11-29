import { doc, getDoc } from "firebase/firestore"
import { fs } from "../firebaseConfig"

const getStock = async (stock: string) => {
    const stockRef = doc(fs, 'menu', stock)
    const stockDoc = await getDoc(stockRef)
    const stockData = stockDoc.data()
    return stockData ? stockData.stock : null
}

export default getStock