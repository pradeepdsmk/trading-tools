var RsecBill = (() => {

    const selQuantity = 'input[name="quantity"]'
    const selBuy = 'input[name="buy"]'
    const selSell = 'input[name="sell"]'
    const selGrossProfit = 'input[name="gross-profit"]'
    const selBrokerage = 'input[name="brokerage"]'
    const selExchangeTransactionCharges = 'input[name="exchange-transaction-charges"]'
    const selSebiTurnoverFee = 'input[name="sebi-turnover-fee"]'
    const selGst = 'input[name="gst"]'
    const selSecuritiesTransactionTax = 'input[name="securities-transaction-tax"]'
    const selNetProfit = 'input[name="net-profit"]'
    const selTradeRow = 'tr.trade'
    const classColored = 'colored'
    const colorRed = 'red'
    const colorGreen = 'green'

    var tbody
    var map
    var rowTemplate
    var addRowbutton

    var totalGrossProfit
    var totalBrokerage
    var totalExchangeTransactionCharges
    var totalSebiTurnoverFee
    var totalGst
    var totalSecuritiesTransactionTax
    var totalNetProfit

    var init = () => {
        tbody = document.getElementById('trades')
        addRowbutton = document.getElementById('add-row')
        map = new WeakMap()

        totalGrossProfit = document.getElementById('total-gross-profit')
        totalBrokerage = document.getElementById('total-brokerage')
        totalExchangeTransactionCharges = document.getElementById('total-exchange-transaction-charges')
        totalSebiTurnoverFee = document.getElementById('total-sebi-turnover-fee')
        totalGst = document.getElementById('total-gst')
        totalSecuritiesTransactionTax = document.getElementById('total-securities-transaction-tax')
        totalNetProfit = document.getElementById('total-net-profit')

        let firstRow = tbody.children[0]
        rowTemplate = firstRow.cloneNode(true)
        firstRow.remove()

        bindUiActions()

        onAddRow()
    }

    var bindUiActions = () => {
        addRowbutton.addEventListener('click', (e) => {
            return onAddRow()
        })

        tbody.addEventListener('click', (e) => {
            if (e.target.matches('.remove-row')) {
                return onRemoveRow(e)
            }
        })

        tbody.addEventListener('input', (e) => {
            if (e.target.matches(selQuantity)
                || e.target.matches(selBuy)
                || e.target.matches(selSell)) {
                return onQuantityBuySellChanged(e)
            }
        })
    }

    var onAddRow = () => {
        let row = rowTemplate.cloneNode(true)
        let trade = new Trade(row)
        map.set(row, trade)
        tbody.appendChild(row)
    }

    var onRemoveRow = (e) => {
        let row = e.target.closest(selTradeRow)
        let trade = map.get(row)
        map.delete(row)
        delete trade
        row.remove()
        if (tbody.children.length === 0) {
            onAddRow()
        }
    }

    var onQuantityBuySellChanged = (e) => {
        let row = e.target.closest(selTradeRow)
        let trade = map.get(row)
        trade.update()

        let trades = tbody.children
        let sumGrossProfit = 0
        let sumBrokerage = 0
        let sumExchangeTransactionCharges = 0
        let sumSebiTurnoverFee = 0
        let sumGst = 0
        let sumSecuritiesTransactionTax = 0
        let sumNetProfit = 0
        for (let i = 0; i < trades.length; i++) {
            row = trades[i]
            trade = map.get(row)
            
            sumGrossProfit += trade._grossProfit.get()
            sumBrokerage += trade._brokerage.get()
            sumExchangeTransactionCharges += trade._exchangeTransactionCharges.get()
            sumSebiTurnoverFee += trade._sebiTurnoverFee.get()
            sumGst += trade._gst.get()
            sumSecuritiesTransactionTax += trade._securitiesTransactionTax.get()
            sumNetProfit += trade._netProfit.get()
        }

        sumNetProfit -= 0.5

        totalGrossProfit.value = sumGrossProfit.toFixed(2)
        totalBrokerage.value = sumBrokerage.toFixed(4)
        totalExchangeTransactionCharges.value = sumExchangeTransactionCharges.toFixed(4)
        totalSebiTurnoverFee.value = sumSebiTurnoverFee.toFixed(4)
        totalGst.value = sumGst.toFixed(4)
        totalSecuritiesTransactionTax.value = sumSecuritiesTransactionTax.toFixed(4)
        totalNetProfit.value = sumNetProfit.toFixed(2)

        if(sumGrossProfit > 0) {
            totalGrossProfit.dataset.color = colorGreen
        } else if(sumGrossProfit < 0) {
            totalGrossProfit.dataset.color = colorRed
        } else {
            delete totalGrossProfit.dataset.color
        }

        if(sumNetProfit > 0) {
            totalNetProfit.dataset.color = colorGreen
        } else if(sumNetProfit < 0) {
            totalNetProfit.dataset.color = colorRed
        } else {
            delete totalNetProfit.dataset.color
        }
    }


    class TradeField {
        constructor(tr, selector, decimals = 2, userEditable = true) {
            this._field = tr.querySelector(selector)

            if (decimals < 0) {
                decimals = 0
            } else if (decimals > 4) {
                decimals = 4
            }
            this._decimals = decimals

            this._readFromInput()

            this.userEditable = userEditable

            let tradeField = this
            if (userEditable) {
                this._field.addEventListener('input', _inputUpdated)
            }
            function _inputUpdated(e) {
                tradeField._readFromInput()
            }

            this._colored = false
            if (this._field.classList.contains(classColored)) {
                this._colored = true
            }
        }

        _readFromInput() {
            let value = this._field.value
            this._value = this._parseValue(value)
        }

        _parseValue(value) {
            value = Number(value)
            if (isNaN(value)) {
                value = 0
            }
            return value
        }

        get() {
            return this._value
        }

        set(value) {
            value = this._parseValue(value)
            this._field.value = value.toFixed(this._decimals)
            this._value = value
            this._updateFieldColor()
        }

        _updateFieldColor() {
            if (this._colored) {
                if (this._value < 0) {
                    this._field.dataset.color = colorRed
                } else {
                    this._field.dataset.color = colorGreen
                }
            } else {
                if ('color' in this._field.dataset) {
                    delete this._field.dataset.color
                }
            }
        }
    }

    class Trade {

        constructor(tr) {
            this._tr = tr

            this._quantity = new TradeField(tr, selQuantity)
            this._buy = new TradeField(tr, selBuy)
            this._sell = new TradeField(tr, selSell)
            this._grossProfit = new TradeField(tr, selGrossProfit, 2, false)
            this._brokerage = new TradeField(tr, selBrokerage, 4, false)
            this._exchangeTransactionCharges = new TradeField(tr, selExchangeTransactionCharges, 4, false)
            this._sebiTurnoverFee = new TradeField(tr, selSebiTurnoverFee, 4, false)
            this._gst = new TradeField(tr, selGst, 4, false)
            this._securitiesTransactionTax = new TradeField(tr, selSecuritiesTransactionTax, 4, false)
            this._netProfit = new TradeField(tr, selNetProfit, 2, false)
        }

        update() {
            let quantity = this._quantity.get()
            let buy = this._buy.get()
            let sell = this._sell.get()

            let grossProfit = (sell - buy) * quantity
            this._grossProfit.set(grossProfit)

            let brokerage = (this._calculateBrokerage(buy) + this._calculateBrokerage(sell)) * quantity
            this._brokerage.set(brokerage)

            let totalTransactionAmount = (buy + sell) * quantity

            let exchangeTransactionCharges = totalTransactionAmount * 0.00325 / 100
            this._exchangeTransactionCharges.set(exchangeTransactionCharges)

            let sebiTurnoverFee = totalTransactionAmount * 0.0001 / 100
            this._sebiTurnoverFee.set(sebiTurnoverFee)

            let gst = (brokerage + exchangeTransactionCharges + sebiTurnoverFee) * 18 / 100
            this._gst.set(gst)

            let securitiesTransactionTax = sell * quantity * 0.025 / 100
            this._securitiesTransactionTax.set(securitiesTransactionTax)

            let netProfit = grossProfit - (brokerage + exchangeTransactionCharges + sebiTurnoverFee + gst + securitiesTransactionTax)
            this._netProfit.set(netProfit)

        }

        _calculateBrokerage(price) {
            if (price === 0) {
                return 0
            } else if (price < 40) {
                return 0.02
            } else {
                return price * 0.05 / 100
            }
        }
    }

    return {
        init: init
    }

})()

window.addEventListener('load', () => {
    RsecBill.init()
})



