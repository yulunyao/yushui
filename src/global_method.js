// Formatter
function stateFormatter(state) {
  if (state != null) {
    if (state === '100') {
      return '开'
    } else {
      return '关'
    }
  } else {
    return '-'
  }
}

function instantFormatter (value) {
  if (value != null) {
    return value + ' L/s'
  } else {
    return '-'
  }
}

function codFormatter (value) {
  if (value != null) {
    return value + ' mg/L'
  } else {
    return '-'
  }
}

function phFormatter (value) {
  if (value != null) {
    return value
  } else {
    return '-'
  }
}
