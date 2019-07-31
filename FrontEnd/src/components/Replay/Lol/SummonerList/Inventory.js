import React, { PureComponent } from 'react'
import styled from 'styled-components'

const importAll = req => {
    return req.keys().reduce((prev, r) => {
        // Split by directory and then reverse to get the filename
        const [itemId] = r.split('/').reverse()

        // Remove the extension from the file name.
        const key = itemId.substr(0, itemId.length - 4)

        // Require the file and assign it to the itemId property
        return {
            ...prev,
            [key]: req(r),
        }
    }, {})
}

const itemIcons = importAll(require.context('../../../../assets/Lol/item', true, /.png$/))

const InventoryWrapper = styled.div`
    width: 170px;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 400;
    padding: 1px;
`

const CategoryHeader = styled.div`
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 5px 0 20px;
`

const ItemIcon = styled.img`
    max-height: 30px;
    max-width: 30px;
    width: auto;
    height: auto;
    display: inline-block;
    justify-self: center;
`

const WardIconWrapper = styled.div`
    grid-column: 4;
    grid-row: 1 / 3;
    height: 100%;
    white-space: nowrap;
    text-align: center;
`

const WardIconHolder = styled.div`
    width: 32px;
    height: 32px;
    border: 1px solid #000011
    display: inline-block;
    margin: 20px 0px;
    justify-self: center;
    padding: 3px 1px 1px 1px;
    background-color: #00001a;
    vertical-align: middle;
`

const WardIcon = styled.img`
    max-height: 30px;
    max-width: 30px;
    width: auto;
    height: auto;
    display: inline-block;
    justify-self: center;
`

const StyledInventoryIcons = styled.div`
    border-radius: 4px;
    width: 160px;
    margin: 2px auto;
    display: grid;
    grid-column-gap: 4px;
    grid-row-gap: 4px;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(15px, auto);
    padding: 4px;
    background-color: #15062c;
`

const ItemIconPlaceholder = styled.div`
    width: 32px;
    height: 32px;
    border: 1px solid #000011
    display: inline-block;
    justify-self: center;
    grid-column: ${props => props.index % 3 + 1};
    grid-row:  ${props => props.index / 3 + 1};
    padding: 3px 1px 1px 1px;
    background-color: #00001a;
`

const INVENTORY_TRIKETS = [3340, 3460, 3461, 3363, 3364]


const EquipmentIcons = ({ items }) =>
    <StyledInventoryIcons>
        {items.map((item, index) => {
            // Handle ward items
            if(INVENTORY_TRIKETS.includes(item)){
                return (
                    <WardIconWrapper key={index}>
                        <WardIconHolder>
                            <WardIcon src={itemIcons[item]}/>
                        </WardIconHolder>
                    </WardIconWrapper>
                )
            }
            else if(index === 6)
                return (
                    <WardIconWrapper key={index}>
                        <WardIconHolder>
                            &nbsp;
                        </WardIconHolder>
                    </WardIconWrapper>
                )

            if(item === 0)
                return <ItemIconPlaceholder index={index} key={index}>&nbsp;</ItemIconPlaceholder>

            return <ItemIconPlaceholder index={index} key={index}><ItemIcon src={itemIcons[item]}/></ItemIconPlaceholder>
        })}
    </StyledInventoryIcons>

class Inventory extends PureComponent {
    render() {
        let items = this.props.items

        // for place holders
        while(items.length < 7)
            items.push(0)

        const wardItem = items.find(p => INVENTORY_TRIKETS.includes(p))
        if(wardItem) {
            const wardIndex = items.indexOf(wardItem)
            items = items.slice(0, wardIndex).concat(items.slice(wardIndex + 1, 10))
            items.push(wardItem)
        }

        return (
            <InventoryWrapper>
                <CategoryHeader>Inventory</CategoryHeader>
                <EquipmentIcons items={items} />
            </InventoryWrapper>
        )
    }
}

export default Inventory
