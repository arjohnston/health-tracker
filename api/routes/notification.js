const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport)
const Notification = require('../models/Notification')
const config = require('../../util/settings')
const {
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  BAD_REQUEST
} = require('../../util/statusCodes')

// Submit an entry
router.post('/create', (req, res) => {
  if (!req.body.token) return res.sendStatus(BAD_REQUEST)

  const token = req.body.token.replace(/^JWT\s/, '')

  const data = {
    type: req.body.type,
    message: req.body.message,
    date: req.body.date
  }

  if (req.body.isRead) data.isUnread = false

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      Notification.create(
        { user: decoded.username, ...data },
        (error, post) => {
          if (error) {
            return res.sendStatus(BAD_REQUEST)
          }

          return res.sendStatus(OK)
        }
      )
    }
  })
})

router.post('/markAsRead', (req, res) => {
  if (!req.body.token) return res.sendStatus(BAD_REQUEST)

  const token = req.body.token.replace(/^JWT\s/, '')

  const query = {
    ...req.body
  }
  delete query.token

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      Notification.updateOne(
        { user: decoded.username, ...query },
        { isUnread: false },
        function (error, result) {
          if (error) {
            return res.sendStatus(BAD_REQUEST)
          }

          if (result.nModified < 1) {
            return res
              .status(NOT_FOUND)
              .send({ message: `${req.body.name} not found.` })
          }

          return res
            .status(OK)
            .send({ message: `${req.body.name} was updated.` })
        }
      )
    }
  })
})

// Return an array of objects of entries
router.post('/getNotifications', (req, res) => {
  if (!req.body.token) return res.sendStatus(BAD_REQUEST)

  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      Notification.find({ user: decoded.username }, (error, notifications) => {
        if (error) {
          return res.sendStatus(BAD_REQUEST)
        }

        return res.status(OK).send(notifications)
      })
    }
  })
})

router.post('/deleteAll', (req, res) => {
  if (!req.body.token) return res.sendStatus(BAD_REQUEST)

  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      Notification.deleteMany({ user: decoded.username }, (error, entries) => {
        if (error) {
          return res.sendStatus(BAD_REQUEST)
        }

        return res.sendStatus(OK)
      })
    }
  })
})

module.exports = router
