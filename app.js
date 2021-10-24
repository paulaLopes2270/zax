import { motoboyList } from "./storeData.js"
import { requestByMotoboy } from "./services.js"

const setMotoboyOptionListOnHTML = () => {
    const createMotoboyOptionList = (motoboyList) => {
        return motoboyList.map(({ id, name }) => {
            return `<option value="${id}">${name}</option>`
        }).join("")
    }

    const motoboyOptionList = createMotoboyOptionList(motoboyList)
    const selectElement = document.querySelector(`[data-motoboy="select"]`)
    selectElement.innerHTML += motoboyOptionList
}

setMotoboyOptionListOnHTML()


const createMotoboyCardElement = (motoboyData) => {
    const { name, numberOfRequest, requestList, formatedTotalComissionValue } = motoboyData

    return `
<div class="motoboy-card">
    <h3>${name}</h3>
    <div>
        <p><strong>Total de Pedidos:</strong> ${numberOfRequest}</p>
        <h4>Lojas</h4>
        ${requestList.map(({ store, calculateComissionValue }) => {
            return `<p><strong>${store}: </strong>${calculateComissionValue.formatedValue}</p>`
        }).join("")}
    </div>
    <div>
        <h4>Comissão total</h4>
        <p><strong>${formatedTotalComissionValue}</strong></p>
    </div>
</div>
    `
}

const getSelectedMotoboyID = (event) => {
    const { select } = event.target
    return !!select.value && select.value
}

const setCardsOnDataShowElement = (card) => {
    const dataShowElement = document.querySelector("[data-show]")
    dataShowElement.innerHTML = card
}

const formSubmitFunction = (event) => {
    const motoboySelectedId = getSelectedMotoboyID(event)

    if (motoboySelectedId) {
        const selectedMotoboyData = requestByMotoboy[motoboySelectedId]
        const motoboyCardElement = createMotoboyCardElement(selectedMotoboyData)
        setCardsOnDataShowElement(motoboyCardElement)
        return
    }

    const motoboyNameList = Object.keys(requestByMotoboy)
    const allMotoboyCardList = motoboyNameList.map(currentId => {
        const motoboyData = requestByMotoboy[currentId]
        const cardElement = createMotoboyCardElement(motoboyData)
        return cardElement
    }).join("")
    setCardsOnDataShowElement(allMotoboyCardList)
}

const addFormSubmitFunction = (submitFunction = false) => {
    const formElement = document.querySelector(`[data-motoboy="form"]`)
    formElement.addEventListener("submit", (event) => {
        event.preventDefault()

        submitFunction && submitFunction(event)
    })
}
addFormSubmitFunction(formSubmitFunction)