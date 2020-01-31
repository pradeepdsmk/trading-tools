$(() => {
    $('#trades').on('keyup', 'tr.buy input[name="quantity"]', (e) => {
        onBuyQuantityUpdated(e.target)
    })
})

function onBuyQuantityUpdated(uiBuyQuantity) {
    let quantity = parseInt($(uiBuyQuantity).val())
    uiStock = uiBuyQuantity.closest('tbody');
    updateSellQuantity(uiStock, quantity)
    updateBuy(uiStock)
    updateSell(uiStock)
}

function onGrossBuyUpdated() {

}

function onGrossSellUpdated() {

}

function updateSellQuantity(uiStock, quantity) {
    uiStock.find('tr.sell input[name="quantity"]').val(quantity)
}

function updateBuy(uiStock) {
    updateSummary(uiStock)
}

function updateSell(uiStock) {
    updateSummary(uiStock)
}

function updateSummary(uiStock) {

}

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

class TradeRow {
    constructor(tradeId) {
        this._tradeId = tradeId
        this._grossBuy = 0
        this._grossSell = 0
        this._quantity = 0
        this._brokerage = 0.02
        this._netBuy = 0
        this._netSell = 0
        this._totalBuy = 0
        this._totaySell = 0
        this._summary = 0

        this.uiTbody = $()
    }

    grossBuy(val) {
        if (typeof val === 'undefined') {
            return this._grossBuy
        } else {
            this._grossBuy = val

        }
    }
}



var TradesTable = (function () {
    var trades = []
    var tradeIdSeries
    var uiTradesTable
    var uiStockRowTemplate

    var init = function () {
        trades = []
        tradeIdSeries = new IdSeries('trade-row')
        uiTradesTable = $('#trades')
        let uiStockRow = $(uiTradesTable.find('tbody.stock').get(0))
        uiStockRowTemplate = uiStockRow.clone()
        uiStockRow.remove()
        console.log(uiStockRowTemplate)
    }

    var add = function () {
        let tradeId = tradeIdSeries.next()
        let tradeRow = new TradeRow(tradeId)
        trades.push(tradeRow)

        uiTradesTable.append(uiStockRowTemplate.clone())
    }

    return {
        init: init,
        add: add
    }
})()

TradesTable.init()
TradesTable.add()
TradesTable.add()