NyancatScrollView = require './nyancat-scroll-view'
{CompositeDisposable} = require 'atom'

module.exports = NyancatScroll =
  NyancatScrollView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @view = new NyancatScrollView()
    @subs = new CompositeDisposable

    @subs.add atom.workspace.observeActivePaneItem =>
      @unsubLastActive()
      @subActive()
      @update()

  deactivate: ->
    @unsubLastActive()
    @subs.dispose()
    @view.destroy()
    @statusBar = null

  consumeStatusBar: (statusBar) ->
    @statusBar = statusBar
    priority = 500
    @view.mount(@statusBar, priority)

  subActive: ->
    editor = atom.workspace.getActiveTextEditor()
    if not editor?
      return
    editorElement = editor.getElement()
    @editor_subs = new CompositeDisposable
    @editor_subs.add editorElement.onDidChangeScrollTop (top) =>
      @update()
    @update() # update once regardles

  unsubLastActive: ->
    if @editor_subs?
      @editor_subs.dispose()
    @editor_subs = null

  update: ->
    editor = atom.workspace.getActiveTextEditor()
    @view.clear()
    if editor?
      lastVisibleRow = editor.getFirstVisibleScreenRow()
      lastScreenLine = editor.getLineCount() - editor.rowsPerPage
      if lastScreenLine >= 0
        percent = lastVisibleRow/parseFloat(lastScreenLine)
      else
        percent = 1
    else
      percent = 1
    @view.updateScroll(percent)
