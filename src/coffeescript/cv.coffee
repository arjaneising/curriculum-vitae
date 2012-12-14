nextHash = null
wrapper = null
tooltipElm = null



init = ->
  if checkDependencies()
    window.addEventListener 'load', continueInit, false



# Fuck off IE8-
checkDependencies = ->
  return false unless 'addEventListener' of window
  return false unless 'querySelectorAll' of document
  return false unless 'classList' of document.body
  true



continueInit = ->
  changeDom()
  setEvents()



# Add wrapper
# Put everything in it except the NAV
changeDom =  ->
  elms = document.querySelectorAll 'body > *'
  wrapper = document.createElement 'div'
  wrapper.classList.add 'wrapper'

  for elm in elms
    continue if elm.nodeName.toLowerCase() is 'nav'
    wrapper.appendChild elm

  document.body.appendChild wrapper



# Listening to you, kicking and clicking
setEvents = ->
  window.addEventListener 'scroll', setNavBar, false
  setNavBar()

  linksWithHash = document.querySelectorAll 'a[href*="#"]'
  for elm in linksWithHash
    elm.addEventListener 'click', smoothScroll, false

  for trans in ['webkitTransitionEnd', 'oTransitionEnd', 'otransitionend', 'transitionend']
    document.addEventListener trans, recoverScroll, false



setNavBar = (e) ->
  bestDisplayed = getBestDisplayed()
  setActive(bestDisplayed)



# Changing the active items to nonactive and the best displayed one to active
setActive = (bestDisplayed) ->
  aElm = document.querySelector ".inline-menu a[href$='#{ bestDisplayed.id }']"
  active = document.querySelectorAll ".inline-menu .active"

  [].forEach.call active, (elm)->
    elm.classList.remove 'active'

  aElm.parentNode.classList.add 'active'

  return



# Loop over sections to find the one that is visible on top of the window
getBestDisplayed = ->
  elms = document.getElementsByTagName 'section'
  bestDisplayed = elms[0]
  scroll = window.scrollY + 5

  [].forEach.call elms, (elm) ->
    top = getOffset(elm).top
    if top < scroll
      bestDisplayed = elm

  bestDisplayed



# set css transformation to follow the link with an animation
smoothScroll = (e) ->
  nextHash = e.target.hash

  tgt = document.querySelector nextHash

  return unless tgt

  e.preventDefault()

  toOffset = Math.min(document.body.scrollHeight - window.innerHeight, getOffset(tgt).top)

  diff = document.body.scrollTop - toOffset

  wrapper.classList.add 'animate-scroll'
  wrapper.style.WebkitTransform = "translate(0, #{ diff }px)"
  wrapper.style.MozTransform = "translate(0, #{ diff }px)"
  wrapper.style.MsTransform = "translate(0, #{ diff }px)"
  wrapper.style.OTransform = "translate(0, #{ diff }px)"
  wrapper.style.transform = "translate(0, #{ diff }px)"

  return


# Remove all transform stuff we added
recoverScroll = ->
  return unless (arguments[0].propertyName.indexOf('transform') >= 0) and (arguments[0].srcElement.classList.contains('wrapper'))

  toOffset = document.body.scrollHeight - window.innerHeight

  wrapper.classList.remove 'animate-scroll'
  wrapper.style.WebkitTransform = null
  wrapper.style.MozTransform = null
  wrapper.style.MsTransform = null
  wrapper.style.OTransform = null
  wrapper.style.transform = null

  window.location.hash = nextHash


getOffset = (elm) ->
  _x = 0
  _y = 0
  
  while elm.nodeName.toLowerCase() isnt 'html'
    _x += elm.offsetLeft
    _y += elm.offsetTop
    elm = elm.parentNode

  {
    top: _y
    left: _x
  }




init()