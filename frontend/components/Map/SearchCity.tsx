import { TextField, CircularProgress } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useState, useEffect, Fragment } from 'react';

export interface ETKMapSearchCityProps {
  onChange?(item: any): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchCity: {
      background: '#fff',
      position: 'absolute',
      top: theme.spacing(8),
      right: theme.spacing(2),
    },
  })
);

const ETKMapSearchCity: React.FC<ETKMapSearchCityProps> = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (inputValue === '' || inputValue.length < 3) {
      setOptions([]);
      return undefined;
    }

    (async () => {
      setLoading(true);
      const url = `https://geo.api.gouv.fr/communes?nom=${inputValue}&fields=nom,code,codesPostaux,codeDepartement,centre,codeRegion,population&format=json&geometry=centre`;
      const response = await fetch(url);
      const json = await response.json();

      if (active) {
        const newOptions = json.filter(
          (item) => item.centre && item.centre.coordinates
        );

        const sort = (a, b) => {
          if (a.nom.toLowerCase() < b.nom.toLowerCase()) {
            return -1;
          }

          return 1;
        };

        setOptions(newOptions.sort(sort));
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [value, inputValue]);

  const onChangeHandler = (ev, newValue) => {
    if (newValue) {
      setValue(newValue);
      props.onChange(newValue);
    } else {
      setValue(null);
      setOptions([]);
    }
  };

  return (
    <Autocomplete
      freeSolo
      className={classes.searchCity}
      options={options}
      getOptionLabel={(option) => option.nom}
      loading={loading}
      value={value}
      style={{ width: 300 }}
      onChange={onChangeHandler}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          value={value}
          label="Search for a city"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default ETKMapSearchCity;