import { Link } from "react-router-dom"

export const Patient = (props) => {
    return (
        <div className="patient">
            <button>
                <Link 
                    to= "/patients/patient"
                    state={{from: props.data}}
                >
                    {props.data.email}
                </Link>
            </button>
        </div>
    )
}