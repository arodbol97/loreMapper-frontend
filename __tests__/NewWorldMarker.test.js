import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import NewWorldMarker from '../src/components/NewWorldMarker';

jest.mock('axios');


describe('NewWorldMarker', () => {

    const WORLD_ID = 1;
    const MARKERS = [];
    const KINS = [];
    const FACTIONS = [];
    const POST_RESPONSE = {
        "data": {
            "markerData": {
                "created": true
            }
        }
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call axios with the correct data when form is submitted', async () => {
        const getMarkersMock = jest.fn();
        const setNewPersonMock = jest.fn();
        axios.post.mockResolvedValue(POST_RESPONSE);
        const { container} = render(<NewWorldMarker worldId={WORLD_ID} getMarkers={getMarkersMock} setNewMarker={setNewPersonMock} markers={MARKERS} kins={KINS} factions={FACTIONS} type={'person'}/>);
        const nameInput = container.querySelector('#marker_name_form');
        const descriptionInput = container.querySelector('#marker_description_form');
        const submitButton = container.querySelector('#submit_marker_button');
        const URL = 'https://loremapper-backend-b042c39916b5.herokuapp.com/marker/create'
        const EXPECTED_REQUEST_DATA = {
            markerWorld: WORLD_ID,            
            markerName: 'Person Marker Name',
            markerDescription: 'Person Marker Description',            
            markerFaction: '',
            markerKin: '',
            markerType: 'person',
            personHome: '',
            objectValue: '',
            objectEnchantment: '',
            objectType: 'weapon',
            placePopulation: ''
        };
    
        fireEvent.change(nameInput, { target: { value: 'Person Marker Name' } });
        fireEvent.change(descriptionInput, { target: { value: 'Person Marker Description' } });
        fireEvent.click(submitButton);
    
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalledTimes(1);
          expect(axios.post).toHaveBeenCalledWith(URL, EXPECTED_REQUEST_DATA);
        });
      });



      it('should match snapshot', async () => {
        const getMarkersMock = jest.fn();
        const setNewPersonMock = jest.fn();
        const { asFragment } = render(<NewWorldMarker worldId={WORLD_ID} getMarkers={getMarkersMock} setNewMarker={setNewPersonMock} markers={MARKERS} kins={KINS} factions={FACTIONS} type={'person'}/>);
        expect(asFragment()).toMatchSnapshot();
      });

});
