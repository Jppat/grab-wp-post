import { useState, useEffect } from 'react';
import Button from './Button';


export function useDebounce(value, delay = 500){
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Form(props){
  const debouncedCategory = useDebounce(props.category, 500);  

  return(
    <>
      <form
        className="flex flex-col justify-self-center gap-2 mt-8 mb-8 max-w-fit p-6 rounded-lg shadow-sm" 
        onSubmit={props.onSubmit}>
        <div>
          <label htmlFor="url"><strong>WordPress Site URL: </strong></label>
          <input className="input" type="url" id= "url" name="url" placeholder="Enter URL of WordPress site here" value={props.url} required onChange={e => {
            let input = e.target;
            if (!input.value.startsWith("http://") && !input.value.startsWith("https://")) {
              input.value = "https://" + input.value;
            }
            props.setUrl(input.value)
          }} />
        </div>

        <div>
          <label htmlFor="category"><strong>Category Id: </strong></label>
          <input className="input" type="text" id= "category" name="category" value={props.category} onChange={getSearchedCategory}/>
        </div>

        <div>
          <label htmlFor="date"><strong>Date published: </strong></label>
          <input className="input" type="date" id= "date" name="date"  value={props.date} onChange={e => props.setDate(e.target.value)}/>
        </div>
        <Button btnText={"Submit"} type="submit" />
      </form>
    </>
  )
}

export default Form;