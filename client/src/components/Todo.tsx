type TodoProps = {
    name: string;
    isComplete: boolean;
    setIsComplete: (isComplete: boolean) => void;
}

function Todo({ name, isComplete, setIsComplete }: TodoProps) {
    const handleCheck = () => {
        console.log('checked');
        setIsComplete(!isComplete);
    }

    return (
        <label className='flex gap-2 items-center'>
            <input
                type='checkbox'
                onChange={handleCheck}
                checked={isComplete}
                className='hidden-checkbox'
            />
            <div>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                    <path
                        fill='none'
                        stroke='black'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='64'
                        d='M416 128L192 384l-96-96'
                    />
                </svg>
            </div>
            <span>
                {name}
            </span>
        </label>
    );
}

export default Todo;