$(() => {
    
})


class IdSeries {
    constructor(prefix) {
        this._prefix = prefix
        this._id = 0
    }

    next() {
        this._id++
        return this._prefix + '-' + this._id
    }

    reset() {
        this._id = 0
    }
}

class Stock {
    constructor(uiStock) {        
        this._grossBuy = 0
        this._grossSell = 0
        this._quantity = 0
        this._brokerage = 0.02
        this._netBuy = 0
        this._netSell = 0
        this._totalBuy = 0
        this._totaySell = 0
        this._summary = 0

        this._uiStock = uiStock
        this._stockId = this._uiStock.attr('id')
    }

    grossBuy(val) {
        if (typeof val === 'undefined') {
            return this._grossBuy
        } else {
            this._grossBuy = val

        }
    }

    stockId() {
        return this._stockId
    }


    onBuyQuantityUpdated(uiBuyQuantity) {
        let quantity = parseInt($(uiBuyQuantity).val())
        uiStock = uiBuyQuantity.closest('tbody');
        updateSellQuantity(uiStock, quantity)
        updateBuy(uiStock)
        updateSell(uiStock)
    }

    onGrossBuyUpdated() {

    }

    onGrossSellUpdated() {

    }

    updateSellQuantity(uiStock, quantity) {
        uiStock.find('tr.sell input[name="quantity"]').val(quantity)
    }

    updateBuy(uiStock) {
        updateSummary(uiStock)
    }

    updateSell(uiStock) {
        updateSummary(uiStock)
    }

    updateSummary(uiStock) {

    }
}


var TradesTable = (function () {
    var stocks
    var stockIdSeries
    var uiTradesTable
    var uiStockTemplate

    var init = function () {
        stocks = []
        stockIdSeries = new IdSeries('trade-row')
        uiTradesTable = $('#trades')

        let uiStock = $(uiTradesTable.find('tbody.stock').get(0))
        uiStockTemplate = uiStock.clone()
        uiStock.remove()

        bindUiActions()

        addStock()
    }

    var bindUiActions = function () {
        $('#add-stock').click(function (e) {
            addStock()
        })

        uiTradesTable.on('click', '.remove-stock', (e) => {
            let uiStock = $(e.target).closest('tbody')
            removeStock(uiStock)
        })

        uiTradesTable.on('keyup', 'tr.buy input[name="quantity"]', (e) => {
            // onBuyQuantityUpdated(e.target)

        })
    }

    var addStock = function () {
        let stockId = stockIdSeries.next()

        let uiStock = uiStockTemplate.clone()
        uiStock.attr('id', stockId)

        let stock = new Stock(uiStock)
        stocks.push(stock)

        uiTradesTable.append(uiStock)

        console.log(stocks)
    }

    var removeStock = function (uiStock) {
        let stockId = uiStock.attr('id')

        for (let i = 0; i < stocks.length; i++) {
            if (stocks[i].stockId() === stockId) {
                stocks.splice(i, 1)
                break
            }
        }

        uiStock.remove()

        console.log(stocks)
    }

    return {
        init: init
    }
})()



$(() => {
    TradesTable.init()
})
