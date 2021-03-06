import * as c from '../appConstants';
import request from 'request';

export const fetchingEntities = () => ({
  type: c.RDX_FETCHING_ENTITIES,
});

export const fetchEntitiesSuccess = data => ({
  type: c.RDX_FETCH_ENTITIES_SUCCESS,
  data,
});

export const updateEntitySuccess = data => ({
  type: c.RDX_UPDATE_ENTITY_SUCCESS,
});

export const createEntitySuccess = data => ({
  type: c.RDX_CREATE_ENTITY_SUCCESS,
});

export const deleteEntitySuccess = data => ({
  type: c.RDX_DELETE_ENTITY_SUCCESS,
});

export const fetchEntitiesError = error => ({
  type: c.RDX_FETCH_ENTITIES_ERROR,
  error,
});

export const fetchEntities = entityName => dispatch => {
  dispatch(fetchingEntities());
  const options = {
    uri: `${c.API_URL}/${entityName}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  request(options, (err, rsp, body) => {
    if (err || rsp.statusCode === 401) {
      return dispatch(fetchEntitiesError(err));
    }
    if (!err && rsp.statusCode === 200) {
      const response = JSON.parse(body);
      return dispatch(fetchEntitiesSuccess(response));
    }
  });
};

export const updateEntity = (entityName, updatedEntity) => dispatch => {
  const entityId = updatedEntity.id;
  const options = {
    uri: `${c.API_URL}/${entityName}/${entityId}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    json: updatedEntity,
  };
  request(options, (err, rsp, body) => {
    if (!err && rsp.statusCode === 200) {
      return dispatch(updateEntitySuccess());
    }
  });
};

export const removeEntity = (entityName, id) => dispatch => {
  const options = {
    uri: `${c.API_URL}/${entityName}/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  request(options, (err, rsp, body) => {
    if (!err && rsp.statusCode === 200) {
      return dispatch(fetchEntities(entityName));
    }
  });
};

export const createEntity = (entityName, createdEntity) => dispatch => {
  const options = {
    uri: `${c.API_URL}/${entityName}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    json: createdEntity,
  };
  request(options, (err, rsp, body) => {
    if (!err && rsp.statusCode === 200) {
      dispatch(createEntitySuccess());
      dispatch(fetchEntities(entityName));
    }
  });
};
