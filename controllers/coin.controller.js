var axios = require('axios');
const puppeteer = require("puppeteer")
const Coin = require('../models/Coin.model')
const Browser = require('../models/Browser.model')
const Holder = require('../models/Holder.model')
const HolderDay = require('../models/HolderDay.model')
const HolderHour = require('../models/HolderHour.model')
const HolderMinute = require('../models/HolderMinute.model')
const HolderWeek = require('../models/HolderWeek.model')

function getPromise(contractAddress) {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 0, height: 0 });
    await page.goto(`https://bscscan.com/token/${contractAddress}#balances`, {
      waitUntil: "domcontentloaded",
    });

    const holder = "#ContentPlaceHolder1_tr_tokenHolders div div div div";
    let holderTotal = await page.evaluate(async (holder) => {
      const holderTotal = document.querySelector(holder);


      return Number(holderTotal.innerText.split(' ')[0].replaceAll(',', ''))
    }, holder);
    const newCoin = new Coin({ contractAddress })
    const newHolder = new Holder({ holderTotal })
    await browser.close();
    const checkContractAddress = await Coin.findOne({ contractAddress })
    if (checkContractAddress) {
      newHolder.owner = checkContractAddress
      await newHolder.save()
      checkContractAddress.holders.push(newHolder._id)
      await checkContractAddress.save()
    } else {
      await newCoin.save()
      newHolder.owner = newCoin
      await newHolder.save()
      newCoin.holders.push(newHolder._id)
      await newCoin.save()
    }
    resolve("Success")
  })
}

function initLoad(contractAddress, res) {
  const listPromise = []
  for (let i = 0; i < contractAddress.length; i++) {
    console.log(contractAddress[i].contractAddress)
    listPromise.push(getPromise(contractAddress[i].contractAddress))
  }
  Promise.all(listPromise).then(data => {
    return res.status(200).json({ massage: "Success" })
  }).catch(err => {
    return res.status(500).json({ err })
  })
}

module.exports.createContractAddress = async (req, res, next) => {
  try {
    (async () => {

      const newCoin = new Coin({ contractAddress: req.query.contractAddress })
      const newBrowser = new Browser({ local: req.query.local })
      const checkContractAddress = await Coin.findOne({ contractAddress: req.query.contractAddress })
      const checkBrowser = await Browser.findOne({ local: req.query.local })

      if (checkContractAddress) {
        if (checkBrowser) {
          const isCheckAddress = checkBrowser.coin.includes(checkContractAddress.contractAddress)
          if (!isCheckAddress) {
            checkContractAddress.browser.push(checkBrowser._id)
            await checkContractAddress.save()
            checkBrowser.coin.push(checkContractAddress.contractAddress)
            await checkBrowser.save()
          }
        } else {
          await newBrowser.save()
          checkContractAddress.browser.push(newBrowser._id)
          await checkContractAddress.save()
          newBrowser.coin.push(checkContractAddress.contractAddress)
          await newBrowser.save()
        }
      } else {
        await newBrowser.save()
        newCoin.browser.push(newBrowser._id)
        await newCoin.save()
        newBrowser.coin.push(newCoin.contractAddress)
        await newBrowser.save()
      }

      return res.status(200).json({ massage: "Success" })
    })();
  } catch {
    return res.status(500).json({ massage: "Server error" })
  }
}

module.exports.getContractAddress = async (req, res, next) => {
  var config = {
    method: 'get',
    url: `https://bscscan.com/searchHandler?term=${req.query.contractAddress}&filterby=0`,
    headers: {
      'Cookie': 'ASP.NET_SessionId=5kaluzwr11kkbebzqwhyplu0; __cflb=02DiuJNoxEYARvg2sN5nZBeFpCLNsmCfEL7F8f5qDcMTS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
    }
  };

  return axios(config)
    .then(function (response) {
      let listAddress = []
      const data = response.data.toString().split('\t')
      for (let i = 0; i < data.length; i++) {
        if (data[i].includes('0x') && data[i].length === 42) {
          listAddress.push(data[i])
        }
      }
      res.status(200).json({ data: listAddress })
    })
    .catch(function (error) {
      console.log(error);
      res.status(400).json({ data: error })
    });
}

module.exports.createHolders = async (req, res, next) => {
  try {
    (async () => {
      const contractAddress = await Coin.find({})
      initLoad(contractAddress, res)
    })();
  } catch {
    return res.status(500).json({ massage: "Server error" })
  }
}

module.exports.getHoldersDay = async (req, res, next) => {
  try {
    const holder = await Holder.findOne({ createDate: { $lte: Number(new Date().getTime()) } })
    const newHolderDay = new HolderDay({ holderTotal: holder.holderTotal, createDate: holder.createDate, owner: holder.owner })
    const checkContractAddress = await Coin.findOne({ contractAddress: req.query.contractAddress })
    if (checkContractAddress) {
      await newHolderDay.save()
      checkContractAddress.holderDay.push(newHolderDay._id)
      await checkContractAddress.save()
      return res.status(200).json({ massage: "Success" })
    } else {
      return res.status(401).json({ massage: `Contract address ${req.query.contractAddress} not exist.` })
    }
  } catch {
    return res.status(500).json({ massage: "Server error" })
  }
}

module.exports.getHoldersHour = async (req, res, next) => {
  try {
    const holder = await Holder.findOne({ createDate: { $lte: new Date().getTime() } })
    const newHolderHour = new HolderHour({ holderTotal: holder.holderTotal, createDate: holder.createDate, owner: holder.owner })
    const checkContractAddress = await Coin.findOne({ contractAddress: req.query.contractAddress })
    if (checkContractAddress) {
      await newHolderHour.save()
      checkContractAddress.holderHour.push(newHolderHour._id)
      await checkContractAddress.save()
      return res.status(200).json({ massage: "Success" })
    } else {
      return res.status(401).json({ massage: `Contract address ${req.query.contractAddress} not exist.` })
    }
  } catch {
    return res.status(500).json({ massage: "Server error" })
  }
}

module.exports.getHoldersMinute = async (req, res, next) => {
  try {
    const holder = await Holder.findOne({ createDate: { $lte: new Date().getTime() } })
    const newHolderMinute = new HolderMinute({ holderTotal: holder.holderTotal, createDate: holder.createDate, owner: holder.owner })
    const checkContractAddress = await Coin.findOne({ contractAddress: req.query.contractAddress })
    if (checkContractAddress) {
      await newHolderMinute.save()
      checkContractAddress.holderMinute.push(newHolderMinute._id)
      await checkContractAddress.save()
      return res.status(200).json({ massage: "Success" })
    } else {
      return res.status(401).json({ massage: `Contract address ${req.query.contractAddress} not exist.` })
    }
  } catch {
    return res.status(500).json({ massage: "Server error" })
  }
}

module.exports.getHoldersWeek = async (req, res, next) => {
  try {
    const holder = await Holder.findOne({ createDate: { $lte: new Date().getTime() } })
    const newHolderWeek = new HolderWeek({ holderTotal: holder.holderTotal, createDate: holder.createDate, owner: holder.owner })
    const checkContractAddress = await Coin.findOne({ contractAddress: req.query.contractAddress })
    if (checkContractAddress) {
      await newHolderWeek.save()
      checkContractAddress.holderWeek.push(newHolderWeek._id)
      await checkContractAddress.save()
      return res.status(200).json({ massage: "Success" })
    } else {
      return res.status(401).json({ massage: `Contract address ${req.query.contractAddress} not exist.` })
    }
  } catch {
    return res.status(500).json({ massage: "Server error" })
  }
}

module.exports.getHolders = async (req, res, next) => {
  try {
    const checkContractAddress = await Coin.findOne({ contractAddress: req.query.contractAddress })
    if (checkContractAddress) {
      switch (req.query.timeLine) {
        case 'day': {
          const data = []
          const holder = await HolderDay.find({ owner: checkContractAddress._id })
          for (let i = 0; i < holder.length; i++) {
            data.push([new Date(holder[i].createDate).getTime(), holder[i].holderTotal])
          }
          return res.status(200).json({ data })
        }
        case 'hour': {
          const data = []
          const holder = await HolderHour.find({ owner: checkContractAddress._id })
          for (let i = 0; i < holder.length; i++) {
            data.push([new Date(holder[i].createDate).getTime(), holder[i].holderTotal])
          }
          return res.status(200).json({ data })
        }
        case 'minute': {
          const data = []
          const holder = await HolderMinute.find({ owner: checkContractAddress._id })
          for (let i = 0; i < holder.length; i++) {
            data.push([new Date(holder[i].createDate).getTime(), holder[i].holderTotal])
          }
          return res.status(200).json({ data })
        }
        case 'week': {
          const data = []
          const holder = await HolderWeek.find({ owner: checkContractAddress._id })
          for (let i = 0; i < holder.length; i++) {
            data.push([new Date(holder[i].createDate).getTime(), holder[i].holderTotal])
          }
          return res.status(200).json({ data })
        }
        default: {
          const data = []
          const holder = await Holder.find({ owner: checkContractAddress._id })
          for (let i = 0; i < holder.length; i++) {
            data.push([new Date(holder[i].createDate).getTime(), holder[i].holderTotal])
          }
          return res.status(200).json({ data })
        }
      }
    } else {
      return res.status(401).json({ massage: `Contract address ${req.query.contractAddress} not exist.` })
    }
  } catch {
    return res.status(500).json({ massage: "Server error" })
  }
}

module.exports.getFavoriteCoin = async (req, res, next) => {
  const listFavoriteCoin = await Browser.findOne({ local: req.query.local })

  return res.status(200).json({ data: listFavoriteCoin })
}
