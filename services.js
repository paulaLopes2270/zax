import { motoboyList, storeList } from "./storeData.js"

const getAllRequests = (storeList = []) => {
    const allRequest = storeList.reduce((allRequest, currentStore) => {
        const currentRequestList = currentStore.request
        currentRequestList.map((currentResquest) => {
            currentResquest.storeId = currentStore.id
            currentResquest.store = currentStore.name
            currentResquest.storeComission = currentStore.comission
        })
        allRequest.push(...currentRequestList)

        return allRequest
    }, [])
    return allRequest
}

const allRequest = getAllRequests(storeList)
// console.log("allRequest", allRequest)


const getFirstStoreExclusivityMotoboy = (motoboyList, storeId) => {
    return motoboyList.find((currentMotoboy, index) => {
        const haveExclusivity = currentMotoboy.storeExclusivity == storeId
        if (haveExclusivity) {
            currentMotoboy.motoboyIndex = index
            return currentMotoboy
        } else {
            return false
        }
    })
}

const getMotoboyByRequest = (allRequest, motoboyList) => {
    const newMotoboyList = motoboyList.map((motoboy) => motoboy)

    return allRequest.map((currentRequest) => {
        const { storeId } = currentRequest
        const newMotoboyListIsEmpety = !newMotoboyList.length

        if (newMotoboyListIsEmpety) {
            motoboyList.map((motoboy) => newMotoboyList.push(motoboy))
        }

        const exclusivityMotoboy = getFirstStoreExclusivityMotoboy(newMotoboyList, storeId)

        if (exclusivityMotoboy) {
            const { motoboyIndex } = exclusivityMotoboy

            currentRequest.motoboy = exclusivityMotoboy
            newMotoboyList.splice(motoboyIndex, 1)
            return currentRequest
        }

        const [firstMotoboy] = newMotoboyList
        const firstMotoboyHaveAnyExclusivity = firstMotoboy.storeExclusivity

        if (firstMotoboyHaveAnyExclusivity) {
            newMotoboyList.splice(0, 1)
            const [nextMotoboy] = newMotoboyList
            currentRequest.motoboy = nextMotoboy
            newMotoboyList.splice(0, 1)
            return currentRequest
        }

        currentRequest.motoboy = firstMotoboy
        newMotoboyList.splice(0, 1)
        return currentRequest

    })
}

const requestWhitMotoboy = getMotoboyByRequest(allRequest, motoboyList)
// console.log("requestWhitMotoboy", requestWhitMotoboy)

const formateValueToReal = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const calculateComissionByRequest = (requestWhitMotoboy) => {
    return requestWhitMotoboy.map(currentRequest => {
        const { value, storeComission, motoboy } = currentRequest
        const { commission: mobotoyComission } = motoboy
        const valueWithStoreComission = value / storeComission
        const valueWithStoreAndMotoboyComission = valueWithStoreComission + mobotoyComission
        const formatedValue = formateValueToReal(valueWithStoreAndMotoboyComission)

        currentRequest.calculateComissionValue = { formatedValue, value: valueWithStoreAndMotoboyComission }

        return currentRequest
    })
}

const requestWithComission = calculateComissionByRequest(requestWhitMotoboy)
// console.log("requestWithComission", requestWithComission)


const getRequestByMotoboy = (requestWithComission) => {
    return requestWithComission.reduce((requestByMotoboy, currentRequest) => {
        const { motoboy } = currentRequest
        requestByMotoboy[motoboy.id] = requestByMotoboy[motoboy.id] || { requestList: [], ...motoboy }
        requestByMotoboy[motoboy.id].requestList.push(currentRequest)
        requestByMotoboy[motoboy.id].numberOfRequest = requestByMotoboy[motoboy.id].requestList.length
        const totalComissionValue = requestByMotoboy[motoboy.id].requestList.reduce((comissionTotalValue, currentRequest) => comissionTotalValue + currentRequest.calculateComissionValue.value, 0)
        requestByMotoboy[motoboy.id].formatedTotalComissionValue = formateValueToReal(totalComissionValue)

        return requestByMotoboy
    }, {})
}

export const requestByMotoboy = getRequestByMotoboy(requestWithComission)
// console.log("requestByMotoboy", requestByMotoboy)