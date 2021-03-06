import React, { memo } from "react"
import styled from "../application/theme"

interface CheckboxProps {
  value: boolean
  onChange: (e: any) => void
  id?: string
  label?: string
  style?: any
}

function Checkbox({ label, value, ...props }: CheckboxProps) {
  return (
    <StyledContainer>
      {label && <StyledLabel htmlFor={props.id}>{label}</StyledLabel>}
      <StyledWrap htmlFor={props.id}>
        <StyledInput
          id={props.id}
          type="checkbox"
          checked={value}
          onChange={props.onChange}
        />
        <StyledCheckbox>
          <Icon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
        </StyledCheckbox>
        <div />
      </StyledWrap>
    </StyledContainer>
  )
}

export default memo(Checkbox)

const StyledContainer = styled.div`
  width: 100%;
`

const StyledLabel = styled.label`
  color: ${p => p.theme.colorLabel};
  font-size: ${p => p.theme.textS};
`

const StyledInput = styled.input`
  opacity: 0;
  border: 0;
  height: 0;
  width: 0;
  margin: 0;
  position: absolute;
`

const Icon = styled.svg`
  fill: none;
  stroke: ${p => p.theme.colorText};
  stroke-width: 4px;
  width: 24px;
  transition: 200ms all;
  visibility: hidden;
`

const StyledCheckbox = styled.span`
  height: 30px;
  width: 30px;
  cursor: pointer;
  transition: 100ms all;
  border: ${p => p.theme.border};
  ${p => p.theme.flexCenter};
`
const StyledWrap = styled.label`
  display: flex;

  ${StyledInput} {
    &:checked ~ span {
      /* background-color: ${p => p.theme.colorPlaceholder}; */
      ${Icon} {
        visibility: visible;
      }
    }
  }
`
