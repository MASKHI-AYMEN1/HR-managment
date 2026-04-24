import React from 'react'
import { Control, Controller } from 'react-hook-form'
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
  createButton,
  createDropdown,
} from 'react-simple-wysiwyg'

const BtnAlignLeft   = createButton('Align left',   '⬤', 'justifyLeft')
const BtnAlignCenter = createButton('Align center', '≡', 'justifyCenter')
const BtnAlignRight  = createButton('Align right',  '⬥', 'justifyRight')

const FontSize = createDropdown('Font size', [
  ['Small (12px)',  (s: any) => document.execCommand('fontSize', false, '2'), '2'],
  ['Normal (16px)', (s: any) => document.execCommand('fontSize', false, '3'), '3'],
  ['Medium (18px)', (s: any) => document.execCommand('fontSize', false, '4'), '4'],
  ['Large (24px)',  (s: any) => document.execCommand('fontSize', false, '5'), '5'],
  ['X-Large (32px)',(s: any) => document.execCommand('fontSize', false, '6'), '6'],
])

const FontFamily = createDropdown('Font', [
  ['Sans-serif',  (s: any) => document.execCommand('fontName', false, 'Arial, sans-serif'), 'Arial, sans-serif'],
  ['Serif',       (s: any) => document.execCommand('fontName', false, 'Georgia, serif'), 'Georgia, serif'],
  ['Monospace',   (s: any) => document.execCommand('fontName', false, 'Courier New, monospace'), 'Courier New, monospace'],
  ['Tahoma',      (s: any) => document.execCommand('fontName', false, 'Tahoma, sans-serif'), 'Tahoma, sans-serif'],
  ['Trebuchet',   (s: any) => document.execCommand('fontName', false, 'Trebuchet MS, sans-serif'), 'Trebuchet MS, sans-serif'],
])

interface WysiwygEditorProps {
  name: string
  control: Control<any, any>
  label?: string
  errorMessage?: string
  isInvalid?: boolean
}


function WysiwygEditor({ name, control, label, errorMessage, isInvalid }: WysiwygEditorProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-black/50 dark:text-white mb-1.5">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div
            className={`rounded-xl border ${
              isInvalid
                ? 'border-red-400 dark:border-red-400'
                : 'border-black/10 dark:border-white/20'
            } overflow-hidden`}
          >
            <EditorProvider>
              <Editor
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                containerProps={{
                  style: { minHeight: '160px', fontSize: '14px', color: '#000000' },
                }}
              >
                {/* Row 1 */}
                <Toolbar>
                  <BtnUndo />
                  <BtnRedo />
                  <Separator />
                  <BtnStyles />
                  <FontFamily />
                  <FontSize />
                  <Separator />
                  <BtnClearFormatting />
                </Toolbar>
                {/* Row 2 */}
                <Toolbar>
                  <BtnBold />
                  <BtnItalic />
                  <BtnUnderline />
                  <BtnStrikeThrough />
                  <Separator />
                  <BtnAlignLeft />
                  <BtnAlignCenter />
                  <BtnAlignRight />
                  <Separator />
                  <BtnBulletList />
                  <BtnNumberedList />
                  <Separator />
                  <BtnLink />
                </Toolbar>
              </Editor>
            </EditorProvider>
          </div>
        )}
      />
      {isInvalid && errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  )
}

export default WysiwygEditor
