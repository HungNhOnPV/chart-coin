const puppeteer = require("puppeteer")
const Coin = require('../models/Coin.model')
const Holder = require('../models/Holder.model')
const HolderDay = require('../models/HolderDay.model')
const HolderHour = require('../models/HolderHour.model')
const HolderMinute = require('../models/HolderMinute.model')
const HolderWeek = require('../models/HolderWeek.model')

module.exports.createHolders = async (req, res, next) => {
  try {
    switch (req.query.timeLine) {
      case 'day': {
        const holder = await Holder.findOne({ createDate: { $gte: 1622199249845 } })
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
      }
      case 'hour': {
        const holder = await Holder.findOne({ createDate: { $gte: new Date().getTime() } })
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
      }
      case 'minute': {
        const holder = await Holder.findOne({ createDate: { $gte: new Date().getTime() } })
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
      }
      case 'week': {
        const holder = await Holder.findOne({ createDate: { $gte: new Date().getTime() } })
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
      }
      default: {
        const browser = await puppeteer.launch({
          // headless: false,
          args: [
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
          ],
          slowMo: 50,
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 0, height: 0 });
        await page.goto(`https://bscscan.com/token/${req.query.contractAddress}#balances`, {
          waitUntil: "domcontentloaded",
        });

        const holder = "#ContentPlaceHolder1_tr_tokenHolders div div div div";

        let holderTotal = await page.evaluate(async (holder) => {
          const holderTotal = document.querySelector(holder);


          return Number(holderTotal.innerText.split(' ')[0].replaceAll(',', ''))
        }, holder);

        const newCoin = new Coin({ contractAddress: req.query.contractAddress })
        const newHolder = new Holder({ holderTotal })

        const checkContractAddress = await Coin.findOne({ contractAddress: req.query.contractAddress })

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
        return res.status(200).json({ massage: "Success" })
      }
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