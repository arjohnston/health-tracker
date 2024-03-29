import React, { Component } from 'react'
import axios from 'axios'

// sanitize the values, ensure they're correct:
// no html / XSS
// correct: integer versus string, etc

// for all historical views, add a loader while data is loading

// when item is selected then remove active so filter menu doesnt persist

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      token: '',
      entries: [],
      macros: {},
      addEntryFormShown: false,
      formDate: new Date(),
      formNotes: '',
      formBloodPressure: '',
      formHeartRate: '',
      formDailyExercise: '',
      formWeight: '',
      formFoodCalorie: [],
      formFoodName: [],
      message: '',
      amountOfFoodEntries: 1,
      macroMenuOpen: null
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmitEntry = this.handleSubmitEntry.bind(this)
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    this.setState(
      {
        token: token
      },
      () => this.getEntries()
    )
  }

  getEntries () {
    axios
      .post('/api/dailyEntry/getEntries', { token: this.state.token })
      .then(res => {
        res.data.forEach(e => {
          delete e.user
          delete e._id
          delete e.__v
        })

        const macros = {}
        res.data.forEach(entry => {
          for (let i = 0; i < entry.foodName.length; i++) {
            macros[entry.foodName[i]] = entry.foodCalorie[i]
          }
        })

        this.setState({
          entries: res.data.reverse(),
          macros: macros
        })
      })
  }

  renderEntries () {
    if (!this.state.entries) return

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]

    const entries = this.state.entries.map(
      (entry, index) => {
        let calories = 0

        if (entry.foodCalorie) {
          entry.foodCalorie.forEach(calorie => {
            calories += calorie
          })
        }

        return (
          <li key={index} className='entry'>
            <div style={{ maxWidth: '100px', width: '100%', border: 'none' }}>
              <span>Date: </span>
              {`${months[new Date(entry.date).getMonth()]} ${new Date(
                entry.date
              ).getDate()}, ${new Date(entry.date).getFullYear()}`}
            </div>
            <div>
              <span>Blood Pressure: </span>
              {entry.bloodPressure}
            </div>
            <div>
              <span>Heart Rate: </span>
              {entry.heartRate}
            </div>
            <div>
              <span>Weight: </span>
              {entry.weight}
            </div>
            <div>
              <span>Calories: </span>
              {calories}
            </div>
            <div style={{ maxWidth: '100%', textAlign: 'left' }}>
              <span>Notes: </span>
              {entry.notes}
            </div>
          </li>
        )
      } // make this an object / card
    )

    return (
      <ul className='data-row'>
        <li className='data-header'>
          <div
            style={{
              maxWidth: '100px',
              width: '100%',
              padding: '0 6px 0 0',
              textAlign: 'center'
            }}
          >
            Date
          </div>
          <div
            style={{
              maxWidth: '75px',
              width: '100%',
              padding: '0 6px 0 0',
              textAlign: 'center'
            }}
          >
            Blood Pressure
          </div>
          <div
            style={{
              maxWidth: '75px',
              width: '100%',
              padding: '0 6px 0 0',
              textAlign: 'center'
            }}
          >
            Heart Rate
          </div>
          <div
            style={{
              maxWidth: '75px',
              width: '100%',
              padding: '0 6px 0 0',
              textAlign: 'center'
            }}
          >
            Weight
          </div>
          <div
            style={{
              maxWidth: '75px',
              width: '100%',
              padding: '0 6px 0 0',
              textAlign: 'center'
            }}
          >
            Calories
          </div>
          <div style={{ padding: '0 0 0 6px' }}>Notes</div>
        </li>
        {entries}
      </ul>
    )
  }

  handleShowEntryForm () {
    this.setState({
      addEntryFormShown: true
    })
  }

  handleSubmitEntry (e) {
    e.preventDefault()

    const formFoodName = []
    const formFoodCalorie = []
    Object.keys(this.state).forEach(key => {
      if (key.includes('formFoodName') && key !== 'formFoodName') {
        formFoodName.push(this.state[key])
      }

      if (key.includes('formFoodCalorie') && key !== 'formFoodCalorie') {
        formFoodCalorie.push(this.state[key])
      }
    })

    const data = {
      token: this.state.token,
      date: this.state.formDate,
      notes: this.state.formNotes,
      bloodPressure: this.state.formBloodPressure,
      heartRate: this.state.formHeartRate,
      dailyExercise: this.state.formDailyExercise,
      weight: this.state.formWeight,
      foodCalorie: formFoodCalorie,
      foodName: formFoodName
    }

    axios
      .post('/api/dailyEntry/submit', data)
      .then(res => {
        const state = Object.assign({}, { ...this.state }, null)

        for (let i = 0; i < this.state.amountOfFoodEntries; i++) {
          state[`formFoodName${i}`] = ''
          state[`formFoodCalorie${i}`] = ''
        }

        state.addEntryFormShown = false
        state.formDate = new Date()
        state.formNotes = ''
        state.formBloodPressure = ''
        state.formHeartRate = ''
        state.formDailyExercise = ''
        state.formWeight = ''
        state.formFoodCalorie = []
        state.formFoodName = []
        state.message = ''
        state.amountOfFoodEntries = 1

        this.setState(state)

        this.getEntries() // reload the data
        this.createNotification()
      })
      .catch(error => {
        this.setState({
          message: `There was a problem: ${error}`
        })
      })
  }

  createNotification () {
    const data = {
      token: this.state.token,
      type: 'dailyEntry',
      message: `Daily Entry created at ${new Date()}`,
      isRead: true
    }

    axios.post('/api/notification/create', data)
  }

  handleChange (e) {
    const state = Object.assign({}, { ...this.state }, null)
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  incrementFoodEntriesShown () {
    this.setState((prevState, props) => ({
      amountOfFoodEntries: prevState.amountOfFoodEntries + 1
    }))
  }

  renderFoodEntries () {
    const entries = []

    for (let i = 0; i < this.state.amountOfFoodEntries; i++) {
      const inputState = Object.assign({}, { ...this.state }, null)
      const macros = Object.keys(this.state.macros)
        .filter(name =>
          name
            .toLowerCase()
            .includes(
              this.state[`formFoodName${i}`]
                ? this.state[`formFoodName${i}`].toLowerCase()
                : ''
            )
        )
        .map((foodName, index) => {
          return (
            <li
              key={index}
              onClick={() => {
                inputState[`formFoodName${i}`] = foodName
                inputState[`formFoodCalorie${i}`] = this.state.macros[foodName]
                this.setState({ ...inputState })
              }}
            >
              {foodName}
            </li>
          )
        })

      entries.push(
        <div style={{ width: '100%', display: 'flex' }}>
          <div className='form-input-wrapper form-input-macros-wrapper'>
            <label htmlFor={`formFoodName${i}`}>Food Name</label>
            <input
              type='input'
              name={`formFoodName${i}`}
              id={`formFoodName${i}`}
              value={this.state[`formFoodName${i}`] || ''}
              onChange={this.handleChange}
              autoComplete='off'
              required
            />
            {macros.length > 0 && (
              <div
                className={`form-input-macros${
                  this.state[`formFoodName${i}`] &&
                  this.state[`formFoodName${i}`].length > 3
                    ? ' active'
                    : ''
                }`}
              >
                <ul>{macros}</ul>
              </div>
            )}
          </div>

          <div className='form-input-wrapper'>
            <label htmlFor={`formFoodCalorie${i}`}>Calories</label>
            <input
              type='input'
              name={`formFoodCalorie${i}`}
              id={`formFoodCalorie${i}`}
              value={this.state[`formFoodCalorie${i}`] || 0}
              onChange={this.handleChange}
              required
            />
          </div>
        </div>
      )
    }

    return entries.map((entry, index) => (
      <div key={index} style={{ width: '100%' }}>
        {entry}
      </div>
    ))
  }

  render () {
    const {
      formDate,
      formNotes,
      formBloodPressure,
      formHeartRate,
      formDailyExercise,
      formWeight,
      message
    } = this.state

    let date = formDate

    if (date.getMonth) {
      date = date.toJSON().slice(0, 10)
    }

    return (
      <div className='dashboard-page'>
        <div className='entry-form-wrapper'>
          <button
            onClick={this.handleShowEntryForm.bind(this)}
            className='entry-form-cta'
          >
            Create Entry
          </button>

          {this.state.addEntryFormShown && (
            <form onSubmit={this.handleSubmitEntry}>
              {message !== '' && <span>{message}</span>}

              <div className='form-input-wrapper'>
                <label htmlFor='formDate'>Date</label>
                <input
                  type='date'
                  name='formDate'
                  id='formDate'
                  value={date}
                  onChange={this.handleChange}
                  required
                  style={{ padding: '9px 12px' }}
                />
              </div>

              <div className='form-input-wrapper'>
                <label htmlFor='formBloodPressure'>Blood Pressure</label>
                <input
                  type='input'
                  name='formBloodPressure'
                  id='formBloodPressure'
                  value={formBloodPressure}
                  placeholder='0'
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className='form-input-wrapper'>
                <label htmlFor='formHeartRate'>Heart Rate</label>
                <input
                  type='input'
                  name='formHeartRate'
                  id='formHeartRate'
                  value={formHeartRate}
                  placeholder='0'
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className='form-input-wrapper'>
                <label htmlFor='formDailyExercise'>
                  Daily Exercise (minutes)
                </label>
                <input
                  type='input'
                  name='formDailyExercise'
                  id='formDailyExercise'
                  value={formDailyExercise}
                  placeholder='0'
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className='form-input-wrapper'>
                <label htmlFor='formWeight'>Weight</label>
                <input
                  type='input'
                  name='formWeight'
                  id='formWeight'
                  value={formWeight}
                  placeholder='0'
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {this.renderFoodEntries()}

                <div
                  className='add-new-food-entry-button'
                  onClick={this.incrementFoodEntriesShown.bind(this)}
                >
                  <svg viewBox='0 0 24 24'>
                    <path d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z' />
                  </svg>
                  Add Food Entry
                </div>
              </div>

              <div className='form-input-wrapper' style={{ width: '100%' }}>
                <label htmlFor='formNotes'>Notes</label>
                <textarea
                  name='formNotes'
                  id='formNotes'
                  value={formNotes}
                  placeholder='Your notes here'
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className='button-wrapper'>
                <button type='submit'>
                  <svg viewBox='0 0 24 24'>
                    <path d='M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z' />
                  </svg>
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
        {this.renderEntries()}
      </div>
    )
  }
}
