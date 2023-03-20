import React from 'react';
import Outfit from './Outfit';
import { StyledList } from '../../common/inputs';


export default function OutfitList(props) { 
        if (props.outfits.length === 0) {
            return <h2>Please add your first item</h2>;
        }
        let items = props.outfits.map(item => {

            return  <Outfit key={item.id} outfit={item} />;
        });

        return(
              
            <StyledList >
              {items}
              </StyledList>
        );
    }



