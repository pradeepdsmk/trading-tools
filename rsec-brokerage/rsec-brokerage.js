var Trades = (function () {

    const selTable = 'trades'
    const selTableFooter = 'tfoot'
    const selStock = 'tbody.stock'
    const selAddStock = '#add-stock'
    const selRemoveStock = '.remove-stock'
    const selGrossBuy = 'input[name="gross-buy"]'
    const selGrossSell = 'input[name="gross-sell"]'
    const selBuyQuantity = 'input[name="buy-quantity"]'
    const selSellQuantity = 'input[name="sell-quantity"]'
    const selBuyBrokerage = 'input[name="buy-brokerage"]'
    const selSellBrokerage = 'input[name="sell-brokerage"]'
    const selNetBuy = 'input[name="net-buy"]'
    const selNetSell = 'input[name="net-sell"]'
    const selTotalBuy = 'input[name="total-buy"]'
    const selTotalSell = 'input[name="total-sell"]'
    const selTotalTrade = 'input[name="total-trade"]'


    var table
    var tableFooter

    var init = function () {
        table = document.getElementById(selTable)

        tableFooter = table.querySelector(selTableFooter)

        uiStockTemplate = table.querySelector(selStock)
        uiStockTemplate.remove()

        bindUiActions()

        addRow()
    }

    var bindUiActions = function () {
        table.addEventListener('click', function (e) {
            let element = e.target
            if (element.matches(selAddStock)) {
                return addRow()
            } else if (element.matches(selRemoveStock)) {
                return removeRow(element)
            }
        })

        table.addEventListener('keyup', function (e) {
            let element = e.target
            if (element.matches(selGrossBuy)
                || element.matches(selGrossSell)
                || element.matches(selBuyQuantity)) {
                return updateTotals(element)
            }
        })
    }

    var getUiStock = function (element) {
        return element.closest('tbody')
    }

    var addRow = function () {
        let uiStock = uiStockTemplate.cloneNode(true)
        tableFooter.before(uiStock)
    }

    var removeRow = function (uiRemove) {
        let uiStock = getUiStock(uiRemove)
        uiStock.remove()
    }

    class StockFields {
        constructor(uiStock) {
            this._uiStock = uiStock
        }

        value(selector, data) {
            let input = this._uiStock.querySelector(selector)

            if (typeof (data) === 'undefined') {
                data = Number(input.value)
                if (isNaN(data)) {
                    return 0
                }
                return data
            } else {
                input.value = data
            }
        }
    }

    var updateTotals = function (element) {
        let uiStock = getUiStock(element)
        let stockFields = new StockFields(uiStock)

        let grossBuy = stockFields.value(selGrossBuy)

        let buyQuantity = stockFields.value(selBuyQuantity)

        let buyBrokerage = stockFields.value(selBuyBrokerage)

        let netBuy = grossBuy + buyBrokerage
        stockFields.value(selNetBuy, netBuy.toFixed(2))

        let totalBuy = -(netBuy * buyQuantity)
        stockFields.value(selTotalBuy, totalBuy.toFixed(2))

        let grossSell = stockFields.value(selGrossSell)

        let sellQuantity = buyQuantity
        stockFields.value(selSellQuantity, sellQuantity)

        let sellBrokerage = stockFields.value(selSellBrokerage)

        let netSell = grossSell - sellBrokerage
        stockFields.value(selNetSell, netSell.toFixed(2))

        let totalSell = netSell * sellQuantity
        stockFields.value(selTotalSell, totalSell.toFixed(2))

        let totalTrade = totalBuy + totalSell
        stockFields.value(selTotalTrade, totalTrade.toFixed(2))
    }

    return {
        init: init
    }
})()

document.addEventListener('DOMContentLoaded', function () {
    Trades.init()
})