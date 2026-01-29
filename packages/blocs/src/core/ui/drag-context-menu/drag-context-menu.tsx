import { useCallback, useEffect, useMemo, useState } from "react"
import type { Node as TiptapNode } from "@tiptap/pm/model"
import { offset } from "@floating-ui/react"
import { DragHandle } from "@tiptap/extension-drag-handle-react"

// Hooks
import { usePacepardEditor } from "@/hooks/use-pacepard-editor"
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useUiEditorState } from "@/hooks/use-ui-editor-state"
import { selectNodeAndHideFloating } from "@/hooks/use-floating-toolbar-visibility"

// Primitive UI Components
import { Button, ButtonGroup } from "@/core/primitives/button"
import { Spacer } from "@/core/primitives/spacer"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuGroup,
  MenuGroupLabel,
  MenuButton,
} from "@/core/primitives/menu"
import { Combobox, ComboboxList } from "@/core/primitives/combobox"
import { Separator } from "@/core/primitives/separator"

// Tiptap UI
import { useImageDownload } from "@/core/ui/image-download-button"
import {
  DuplicateShortcutBadge,
  useDuplicate,
} from "@/core/ui/duplicate-button"
import {
  CopyToClipboardShortcutBadge,
  useCopyToClipboard,
} from "@/core/ui/copy-to-clipboard-button"
import {
  DeleteNodeShortcutBadge,
  useDeleteNode,
  deleteNodeAtPosition,
} from "@/core/ui/delete-node-button"
import {
  CopyAnchorLinkShortcutBadge,
  useCopyAnchorLink,
} from "@/core/ui/copy-anchor-link-button"
import { useResetAllFormatting } from "@/core/ui/reset-all-formatting-button"
import { SlashCommandTriggerButton } from "@/core/ui/slash-command-trigger-button"
import {
  AskAiShortcutBadge,
  useAiAsk,
} from "@/core/ui/ai-ask-button"
import { useText } from "@/core/ui/text-button"
import { useHeading } from "@/core/ui/heading-button"
import { useList } from "@/core/ui/list-button"
import { useBlockquote } from "@/core/ui/blockquote-button"
import { useCodeBlock } from "@/core/ui/code-block-button"
import { ColorMenu } from "@/core/ui/color-menu"
import { TableAlignMenu } from "@/core/node/table-node/ui/table-alignment-menu"
import { useTableFitToWidth } from "@/core/node/table-node/ui/table-fit-to-width-button"
import { useTableClearRowColumnContent } from "@/core/node/table-node/ui/table-clear-row-column-content-button"

// Utils
import {
  getNodeDisplayName,
  isTextSelectionValid,
} from "@/utils/collab-helper"
import { SR_ONLY } from "@/utils/base-helper"

import type {
  DragContextMenuProps,
  MenuItemProps,
  NodeChangeData,
} from "@/core/ui/drag-context-menu/drag-context-menu-types"

// Icons
import { GripVerticalIcon } from "@/core/icons/grip-vertical-icon"
import { ChevronRightIcon } from "@/core/icons/chevron-right-icon"
import { Repeat2Icon } from "@/core/icons/repeat-2-icon"
import { TrashIcon } from "@/core/icons/trash-icon"
import { TypeIcon } from "@/core/icons/type-icon"
import { CheckIcon } from "@/core/icons/check-icon"
import "./drag-context-menu.scss"
import { Label } from "@/core/primitives/label"
import { useTocShowTitle } from "@/core/node/toc-node/ui/toc-show-title-button"
import { useShortAnswer } from "@/core/ui/short-answer-button/use-short-answer"
import { isNodeTypeSelected } from "@/utils/base-helper"
import { NodeSelection } from "@tiptap/pm/state"
import type { ShortAnswerAttrs, InputType } from "@/core/node/short-answer-node/short-answer-types"
import { Input } from "@/core/primitives/input"

const useNodeTransformActions = () => {
  const text = useText()
  const heading1 = useHeading({ level: 1 })
  const heading2 = useHeading({ level: 2 })
  const heading3 = useHeading({ level: 3 })
  const bulletList = useList({ type: "bulletList" })
  const orderedList = useList({ type: "orderedList" })
  const taskList = useList({ type: "taskList" })
  const blockquote = useBlockquote()
  const codeBlock = useCodeBlock()
  const shortAnswer = useShortAnswer()

  const mapper = (
    action: ReturnType<
      | typeof useText
      | typeof useHeading
      | typeof useList
      | typeof useBlockquote
      | typeof useCodeBlock
      | typeof useShortAnswer
    >
  ) => ({
    icon: action.Icon,
    label: action.label,
    onClick: action.handleToggle,
    disabled: !action.canToggle,
    isActive: action.isActive,
  })

  const actions = [
    mapper(text),
    ...[heading1, heading2, heading3].map(mapper),
    mapper(bulletList),
    mapper(orderedList),
    mapper(taskList),
    mapper(blockquote),
    mapper(codeBlock),
    mapper(shortAnswer),
  ]

  const allDisabled = actions.every((a) => a.disabled)

  return allDisabled ? null : actions
}

const BaseMenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  isActive = false,
  shortcutBadge,
}) => (
  <MenuItem
    render={
      <Button data-style="ghost" data-active-state={isActive ? "on" : "off"} />
    }
    onClick={onClick}
    disabled={disabled}
  >
    <Icon className="tiptap-button-icon" />
    <span className="tiptap-button-text">{label}</span>
    {shortcutBadge}
  </MenuItem>
)

const SubMenuTrigger: React.FC<{
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}> = ({ icon: Icon, label, children }) => (
  <Menu
    placement="right"
    trigger={
      <MenuItem
        render={
          <MenuButton
            render={
              <Button data-style="ghost">
                <Icon className="tiptap-button-icon" />
                <span className="tiptap-button-text">{label}</span>
                <Spacer />
                <ChevronRightIcon className="tiptap-button-icon" />
              </Button>
            }
          />
        }
      />
    }
  >
    <MenuContent portal>
      <ComboboxList>{children}</ComboboxList>
    </MenuContent>
  </Menu>
)

const TransformActionGroup: React.FC = () => {
  const actions = useNodeTransformActions()
  const { canReset, handleResetFormatting, label, Icon } =
    useResetAllFormatting({
      hideWhenUnavailable: true,
      preserveMarks: ["inlineThread"],
    })

  if (!actions && !canReset) return null

  return (
    <>
      {actions && (
        <SubMenuTrigger icon={Repeat2Icon} label="Turn Into">
          <MenuGroup>
            <MenuGroupLabel>Turn into</MenuGroupLabel>
            {actions.map((action) => (
              <BaseMenuItem key={action.label} {...action} />
            ))}
          </MenuGroup>
        </SubMenuTrigger>
      )}

      {canReset && (
        <BaseMenuItem
          icon={Icon}
          label={label}
          disabled={!canReset}
          onClick={handleResetFormatting}
        />
      )}
    </>
  )
}

const TableFitToWidth: React.FC = () => {
  const { canFitToWidth, handleFitToWidth, label, Icon } = useTableFitToWidth({
    hideWhenUnavailable: true,
  })
  const clearAllContents = useTableClearRowColumnContent({ resetAttrs: true })

  return (
    <>
      {canFitToWidth && (
        <BaseMenuItem
          icon={Icon}
          label={label}
          disabled={!canFitToWidth}
          onClick={handleFitToWidth}
        />
      )}

      {clearAllContents.canClearRowColumnContent && (
        <BaseMenuItem
          icon={clearAllContents.Icon}
          label={"Clear all contents"}
          disabled={!clearAllContents.canClearRowColumnContent}
          onClick={clearAllContents.handleClear}
        />
      )}
    </>
  )
}

const TocShowTitle: React.FC = () => {
  const { canToggle, handleToggle, label, Icon } = useTocShowTitle({
    hideWhenUnavailable: true,
  })

  if (!canToggle) return null

  return (
    <BaseMenuItem
      icon={Icon}
      label={label}
      disabled={!canToggle}
      onClick={handleToggle}
    />
  )
}

const INPUT_TYPE_OPTIONS: { value: InputType; label: string }[] = [
  { value: "text", label: "Short answer" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "url", label: "URL" },
]

const ShortAnswerPropertyGroup: React.FC = () => {
  const { editor } = usePacepardEditor()

  if (!editor || !isNodeTypeSelected(editor, ["shortAnswer"])) return null

  const { selection } = editor.state
  const attrs: ShortAnswerAttrs =
    selection instanceof NodeSelection && selection.node.type.name === "shortAnswer"
      ? (selection.node.attrs as ShortAnswerAttrs)
      : {}

  const update = useCallback(
    (next: Partial<ShortAnswerAttrs>) => {
      editor.chain().focus().updateAttributes("shortAnswer", next).run()
    },
    [editor]
  )

  const inputType = (attrs.inputType ?? "text") as InputType
  const isNumber = inputType === "number"
  const hasMinChars = attrs.minChars != null
  const hasMaxChars = attrs.maxChars != null
  const hasDefaultAnswer = attrs.defaultAnswer != null

  return (
    <MenuGroup>
      <div className="short-answer-property-group">
        <div className="short-answer-property-row">
          <span className="short-answer-property-label">Required</span>
          <button
            type="button"
            className="short-answer-property-toggle"
            data-state={attrs.required ? "on" : "off"}
            onClick={() => update({ required: !attrs.required })}
            aria-label={attrs.required ? "Required (on)" : "Required (off)"}
          />
        </div>

        <div className="short-answer-property-row">
          <span className="short-answer-property-label">Default answer</span>
          <button
            type="button"
            className="short-answer-property-toggle"
            data-state={hasDefaultAnswer ? "on" : "off"}
            onClick={() =>
              update({
                defaultAnswer: hasDefaultAnswer ? null : "",
              })
            }
            aria-label={hasDefaultAnswer ? "Default answer (on)" : "Default answer (off)"}
          />
        </div>
        {hasDefaultAnswer && (
          <div className="short-answer-property-input-wrap">
            <Input
              type="text"
              value={attrs.defaultAnswer ?? ""}
              placeholder="Optional"
              onChange={(e) => update({ defaultAnswer: e.target.value || null })}
            />
          </div>
        )}

        {!isNumber && (
          <>
            <div className="short-answer-property-row">
              <span className="short-answer-property-label">Min characters</span>
              <button
                type="button"
                className="short-answer-property-toggle"
                data-state={hasMinChars ? "on" : "off"}
                onClick={() =>
                  update({
                    minChars: hasMinChars ? null : 0,
                  })
                }
                aria-label={hasMinChars ? "Min characters (on)" : "Min characters (off)"}
              />
            </div>
            {hasMinChars && (
              <div className="short-answer-property-input-wrap">
                <Input
                  type="number"
                  min={0}
                  value={attrs.minChars ?? ""}
                  placeholder="—"
                  onChange={(e) => {
                    const v = e.target.value
                    update({ minChars: v === "" ? null : Number(v) })
                  }}
                />
              </div>
            )}
            <div className="short-answer-property-row">
              <span className="short-answer-property-label">Max characters</span>
              <button
                type="button"
                className="short-answer-property-toggle"
                data-state={hasMaxChars ? "on" : "off"}
                onClick={() =>
                  update({
                    maxChars: hasMaxChars ? null : 100,
                  })
                }
                aria-label={hasMaxChars ? "Max characters (on)" : "Max characters (off)"}
              />
            </div>
            {hasMaxChars && (
              <div className="short-answer-property-input-wrap">
                <Input
                  type="number"
                  min={0}
                  value={attrs.maxChars ?? ""}
                  placeholder="—"
                  onChange={(e) => {
                    const v = e.target.value
                    update({ maxChars: v === "" ? null : Number(v) })
                  }}
                />
              </div>
            )}
          </>
        )}

        {isNumber && (
          <>
            <div className="short-answer-property-row">
              <span className="short-answer-property-label">Min value</span>
              <button
                type="button"
                className="short-answer-property-toggle"
                data-state={attrs.minValue != null ? "on" : "off"}
                onClick={() =>
                  update({
                    minValue: attrs.minValue != null ? null : 0,
                  })
                }
              />
            </div>
            {attrs.minValue != null && (
              <div className="short-answer-property-input-wrap">
                <Input
                  type="number"
                  value={attrs.minValue ?? ""}
                  placeholder="—"
                  onChange={(e) => {
                    const v = e.target.value
                    update({ minValue: v === "" ? null : Number(v) })
                  }}
                />
              </div>
            )}
            <div className="short-answer-property-row">
              <span className="short-answer-property-label">Max value</span>
              <button
                type="button"
                className="short-answer-property-toggle"
                data-state={attrs.maxValue != null ? "on" : "off"}
                onClick={() =>
                  update({
                    maxValue: attrs.maxValue != null ? null : 100,
                  })
                }
              />
            </div>
            {attrs.maxValue != null && (
              <div className="short-answer-property-input-wrap">
                <Input
                  type="number"
                  value={attrs.maxValue ?? ""}
                  placeholder="—"
                  onChange={(e) => {
                    const v = e.target.value
                    update({ maxValue: v === "" ? null : Number(v) })
                  }}
                />
              </div>
            )}
          </>
        )}

        <div className="short-answer-property-row">
          <span className="short-answer-property-label">Hide</span>
          <button
            type="button"
            className="short-answer-property-toggle"
            data-state={attrs.hidden ? "on" : "off"}
            onClick={() => update({ hidden: !attrs.hidden })}
            aria-label={attrs.hidden ? "Hidden (on)" : "Hidden (off)"}
          />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <BaseMenuItem
        icon={TypeIcon}
        label="Add conditional logic"
        disabled={false}
        onClick={() => update({ conditionalLogic: attrs.conditionalLogic ?? {} })}
      />

      <SubMenuTrigger icon={Repeat2Icon} label="Turn into">
        <MenuGroup>
          <MenuGroupLabel>Turn into</MenuGroupLabel>
          {INPUT_TYPE_OPTIONS.map(({ value, label }) => (
            <MenuItem
              key={value}
              render={
                <Button
                  data-style="ghost"
                  data-active-state={inputType === value ? "on" : "off"}
                />
              }
              onClick={() => update({ inputType: value })}
            >
              {inputType === value ? (
                <CheckIcon className="tiptap-button-icon" />
              ) : (
                <span className="tiptap-button-icon" style={{ width: "1rem", height: "1rem", display: "inline-block" }} aria-hidden="true" />
              )}
              <span className="tiptap-button-text">{label}</span>
            </MenuItem>
          ))}
        </MenuGroup>
      </SubMenuTrigger>
    </MenuGroup>
  )
}

const ImageActionGroup: React.FC = () => {
  const { canDownload, handleDownload, label, Icon } = useImageDownload({
    hideWhenUnavailable: true,
  })

  if (!canDownload) return null

  return (
    <BaseMenuItem
      icon={Icon}
      label={label}
      disabled={!canDownload}
      onClick={handleDownload}
    />
  )
}

const CoreActionGroup: React.FC = () => {
  const {
    handleDuplicate,
    canDuplicate,
    label,
    Icon: DuplicateIcon,
  } = useDuplicate()
  const {
    handleCopyToClipboard,
    canCopyToClipboard,
    label: copyLabel,
    Icon: CopyIcon,
  } = useCopyToClipboard()
  const {
    handleCopyAnchorLink,
    canCopyAnchorLink,
    label: copyAnchorLinkLabel,
    Icon: CopyAnchorLinkIcon,
  } = useCopyAnchorLink()

  return (
    <>
      <Separator orientation="horizontal" />

      <MenuGroup>
        <BaseMenuItem
          icon={DuplicateIcon}
          label={label}
          onClick={handleDuplicate}
          disabled={!canDuplicate}
          shortcutBadge={<DuplicateShortcutBadge />}
        />
        <BaseMenuItem
          icon={CopyIcon}
          label={copyLabel}
          onClick={handleCopyToClipboard}
          disabled={!canCopyToClipboard}
          shortcutBadge={<CopyToClipboardShortcutBadge />}
        />
        <BaseMenuItem
          icon={CopyAnchorLinkIcon}
          label={copyAnchorLinkLabel}
          onClick={handleCopyAnchorLink}
          disabled={!canCopyAnchorLink}
          shortcutBadge={<CopyAnchorLinkShortcutBadge />}
        />
      </MenuGroup>

      <Separator orientation="horizontal" />
    </>
  )
}

const AIActionGroup: React.FC = () => {
  const { handleAiAsk, canAiAsk, Icon: AiAskIcon } = useAiAsk()

  if (!canAiAsk) return null

  return (
    <>
      <MenuGroup>
        {canAiAsk && (
          <BaseMenuItem
            icon={AiAskIcon}
            label="Ask AI"
            onClick={handleAiAsk}
            shortcutBadge={<AskAiShortcutBadge />}
          />
        )}
      </MenuGroup>

      <Separator orientation="horizontal" />
    </>
  )
}

const DeleteActionGroup: React.FC = () => {
  const { handleDeleteNode, canDeleteNode, label, Icon } = useDeleteNode()

  return (
    <MenuGroup>
      <BaseMenuItem
        icon={Icon}
        label={label}
        onClick={handleDeleteNode}
        disabled={!canDeleteNode}
        shortcutBadge={<DeleteNodeShortcutBadge />}
      />
    </MenuGroup>
  )
}

export const DragContextMenu: React.FC<DragContextMenuProps> = ({
  editor: providedEditor,
  withSlashCommandTrigger = true,
  mobileBreakpoint = 768,
  ...props
}) => {
  const { editor } = usePacepardEditor(providedEditor)
  const { aiGenerationActive, isDragging } = useUiEditorState(editor)
  const isMobile = useIsBreakpoint("max", mobileBreakpoint)
  const [open, setOpen] = useState(false)
  const [node, setNode] = useState<TiptapNode | null>(null)
  const [nodePos, setNodePos] = useState<number>(-1)

  const handleNodeChange = useCallback((data: NodeChangeData) => {
    if (data.node) setNode(data.node)
    setNodePos(data.pos)
  }, [])

  useEffect(() => {
    if (!editor) return
    editor.commands.setLockDragHandle(open)
    editor.commands.setMeta("lockDragHandle", open)
  }, [editor, open])

  const mainAxisOffset = 16

  const dynamicPositions = useMemo(() => {
    return {
      middleware: [
        offset((props) => {
          const { rects } = props
          const nodeHeight = rects.reference.height
          const dragHandleHeight = rects.floating.height

          const crossAxis = nodeHeight / 2 - dragHandleHeight / 2

          return {
            mainAxis: mainAxisOffset,
            // if height is more than 40px, then it's likely a block node
            crossAxis: nodeHeight > 40 ? 0 : crossAxis,
          }
        }),
      ],
    }
  }, [])

  const handleOnMenuClose = useCallback(() => {
    if (editor) {
      editor.commands.setMeta("hideDragHandle", true)
    }
  }, [editor])

  const onElementDragStart = useCallback(() => {
    if (!editor) return
    editor.commands.setIsDragging(true)
  }, [editor])

  const onElementDragEnd = useCallback(() => {
    if (!editor) return
    editor.commands.setIsDragging(false)

    setTimeout(() => {
      editor.view.dom.blur()
      editor.view.focus()
    }, 0)
  }, [editor])

  if (!editor) return null

  const nodeName = getNodeDisplayName(editor)

  return (
    <div
      style={
        {
          "--drag-handle-main-axis-offset": `${mainAxisOffset}px`,
        } as React.CSSProperties
      }
    >
      <DragHandle
        editor={editor}
        onNodeChange={handleNodeChange}
        computePositionConfig={dynamicPositions}
        onElementDragStart={onElementDragStart}
        onElementDragEnd={onElementDragEnd}
        {...props}
      >
        <ButtonGroup
          orientation="horizontal"
          style={{
            ...(aiGenerationActive || isMobile || isTextSelectionValid(editor)
              ? { opacity: 0, pointerEvents: "none" }
              : {}),
            ...(isDragging ? { opacity: 0 } : {}),
          }}
        >
          <Button
            data-style="ghost"
            data-weight="small"
            tabIndex={-1}
            aria-label="Delete"
            tooltip={
              <>
                <div>Delete block</div>
                <DeleteNodeShortcutBadge />
              </>
            }
            disabled={!node || nodePos < 0}
            onClick={() => {
              if (editor && node && nodePos >= 0) {
                deleteNodeAtPosition(editor, nodePos, node.nodeSize)
              }
            }}
          >
            <TrashIcon className="tiptap-button-icon" />
          </Button>
          {withSlashCommandTrigger && (
            <SlashCommandTriggerButton
              node={node}
              nodePos={nodePos}
              data-weight="small"
            />
          )}

          <Menu
            open={open}
            onOpenChange={setOpen}
            placement="left"
            trigger={
              <MenuButton
                render={
                  <Button
                    data-style="ghost"
                    tabIndex={-1}
                    tooltip={
                      <>
                        <div>Click open menu options</div>
                        <div>Drag to move</div>
                      </>
                    }
                    data-weight="small"
                    style={{
                      cursor: "grab",
                      ...(open ? { pointerEvents: "none" } : {}),
                    }}
                    onMouseDown={() =>
                      selectNodeAndHideFloating(editor, nodePos)
                    }
                  >
                    <GripVerticalIcon className="tiptap-button-icon" />
                  </Button>
                }
              />
            }
          >
            <MenuContent
              onClose={handleOnMenuClose}
              autoFocusOnHide={false}
              preventBodyScroll={true}
              portal
            >
              <Combobox style={SR_ONLY} />
              <ComboboxList style={{ minWidth: "15rem" }}>
                <Label>{nodeName}</Label>

                <MenuGroup>
                  <TocShowTitle />
                  <ShortAnswerPropertyGroup />
                  <ColorMenu />
                  <TableAlignMenu />
                  <TableFitToWidth />
                  <TransformActionGroup />
                  <ImageActionGroup />
                </MenuGroup>

                <CoreActionGroup />

                <AIActionGroup />

                <DeleteActionGroup />
              </ComboboxList>
            </MenuContent>
          </Menu>
        </ButtonGroup>
      </DragHandle>
    </div>
  )
}
