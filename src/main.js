import "./css/index.css"
import IMask from "imask"
const ccBgcolor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgcolor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccIcon = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colorsInCard = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    default: ["black", "gray"],
  }

  ccBgcolor1.setAttribute("fill", colorsInCard[type][0])
  ccBgcolor2.setAttribute("fill", colorsInCard[type][1])
  ccIcon.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 31,
      maxLength: 2,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000 ",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000 ",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000 ",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const cardHolder = document.querySelector("#card-holder")
const cardHolderPattern = {
  mask: /^[a-z A-Z.]{1,30}$/,
}

const cardHolderMasked = IMask(cardHolder, cardHolderPattern)

const btn = document.querySelector("#btn-add-cc")
btn.addEventListener("click", () => {
  alert("Seu cartão foi cadastrado com sucesso! 😁")
})

document.querySelector("form").addEventListener("click", (event) => {
  event.preventDefault()
})

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateccNumber(cardNumberMasked.value)
})

function updateccNumber(cardNumber) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText =
    cardNumber.length === 0 ? "1234 5678 9012 3456" : cardNumber
}

cardHolderMasked.on("accept", () => {
  updateCardHolder(cardHolderMasked.value)
})

function updateCardHolder(name) {
  const ccHolder = document.querySelector(".cc-info .cc-holder .value")

  ccHolder.innerText = name.length === 0 ? "FULANO DA SILVA" : name
}

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
