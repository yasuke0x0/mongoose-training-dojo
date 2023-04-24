import {AxiosError} from "axios";
import {Form, Formik} from "formik";
import React, {useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {toast} from "react-toastify";
import * as yup from "yup"
import {UserModel} from "./models";
import {createUser, deleteUser, getUsers, updateUser} from "./requests";
import {Modal} from "react-bootstrap";

function App() {
    const queryClient = useQueryClient()

    const [searchFilters, setSearchFilters] = useState<{ name: string, age: string, email: string }>({
        name: '', age: '', email: ''
    })
    const [isCreateUserFormShown, setIsCreateUserFormShown] = useState<boolean>(false)
    const [modalFormEdition, setModalFormEdition] = useState<{ isShown: boolean, user: UserModel | null }>({
        isShown: false,
        user: null
    })
    const [formSearchUserShown, setFormSearchUserShown] = useState<boolean>(false)


    const getUsersQuery = useQuery<UserModel[], AxiosError>(['getUsers', searchFilters], () => getUsers(searchFilters).then(r => r.data))

    function FormCreateNewUser() {
        const validationSchema = yup.object({
            name: yup.string().required('Name is required'),
            age: yup.number().required("Age is required"),
            email: yup.string().email().required("Email is required"),
        })

        const initialValues: { name?: string, age?: number, email?: string } = {}

        return <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, {setStatus, setSubmitting}) => {
                setTimeout(() => {
                    createUser({name: values.name as string, age: values.age as number, email: values.email as string}).then(r => {
                        queryClient.setQueryData('getUsers', (list: UserModel[] | undefined) => {
                            if (list) {
                                return [r.data, ...list]
                            }
                            return []
                        })

                        setSubmitting(false)
                        setIsCreateUserFormShown(false)
                    }).catch(() => {
                        setStatus('Something went wrong ...')
                        setSubmitting(false)
                    })
                }, 1500);
            }}
        >
            {formik => {
                const {errors, setFieldValue, status, isSubmitting} = formik
                return <Form autoComplete="off">
                    {status && <div className="alert alert-danger" role="alert">{status}</div>}

                    <div className="row mb-2">
                        <div className="col-2">
                            <label className="col-form-label">Name</label>
                        </div>
                        <div className="col-10">
                            <input type="text" name="name" className="form-control" onChange={e => setFieldValue('name', e.target.value)} autoFocus/>
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-2">
                            <label className="col-form-label">Age</label>
                        </div>
                        <div className="col-10">
                            <input type="text" name="age" className="form-control" onChange={e => setFieldValue('age', e.target.value)}/>
                            {errors.age && <div className="text-danger">{errors.age}</div>}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-2">
                            <label className="col-form-label">Email</label>
                        </div>
                        <div className="col-10">
                            <input type="text" name="email" className="form-control" onChange={e => setFieldValue('email', e.target.value)}/>
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                    </div>

                    <div className="d-flex flex-row-reverse">
                        <button className="btn btn-danger ms-2" type="button" onClick={() => setIsCreateUserFormShown(false)}>Cancel</button>
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                            {!isSubmitting && "Add user"}
                            {isSubmitting && <span>
                                Creating <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">...</span>
                            </div>
                            </span>}
                        </button>
                    </div>
                </Form>
            }}

        </Formik>
    }

    function UserCard({user}: { user: UserModel }) {
        const [confirmDeletion, setConfirmDeletion] = useState<boolean>(false)
        const [isDeleting, setIsDeleting] = useState<boolean>(false)

        function handleDeletion() {
            setIsDeleting(true)
            setTimeout(() => {
                deleteUser(user._id).then(r => {
                    toast.info('User has been deleted.')
                }).catch(e => {
                    toast.error('Something went wrong while deleting user.')
                }).finally(() => {
                    setConfirmDeletion(false)
                    setConfirmDeletion(false)
                    queryClient.setQueryData('getUsers', (list: UserModel[] | undefined) => {
                        if (list) {
                            return list.filter(item => item._id !== user._id)
                        }
                        return []
                    })
                })
            }, 1500)
        }

        return <div className="card mb-3" /* style="max-width: 540px;" */>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src="assets/user-placeholder.png" className="img-fluid rounded-start" alt="Avatar placeholder"/>
                    <div className="text-center py-2">
                        {!confirmDeletion && <div className="px-2">
                            <div className="d-grid mb-1">
                                <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeletion(true)}>Delete</button>
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-info btn-sm" onClick={() => setModalFormEdition(prev => ({...prev, isShown: true, user: user}))}>Update</button>
                            </div>
                        </div>}
                        {confirmDeletion && <div className={"px-2"}>
                            <div className="d-grid mb-1">
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeletion()} disabled={isDeleting}>
                                    {!isDeleting && "Confirm deletion"}
                                    {isDeleting && "Deleting ..."}
                                </button>
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-info btn-sm" onClick={() => setConfirmDeletion(false)} disabled={isDeleting}>
                                    Cancel deletion
                                </button>
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <div className="card-text">
                            <div className="row">
                                <div className="col-4">User #:</div>
                                <div className="col-8">{user._id}</div>
                            </div>
                            <div className="row">
                                <div className="col-4">Name:</div>
                                <div className="col-8">{user.name}</div>
                            </div>
                            <div className="row">
                                <div className="col-4">Age:</div>
                                <div className="col-8">{user.age}</div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-4">Email:</div>
                                <div className="col-8">{user.email}</div>
                            </div>
                            <p className="card-text"><small className="text-muted">Last updated {user.updatedAt.fromNow()}</small></p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    }

    function UsersList() {
        return <>
            {/* Loading */}
            {getUsersQuery.isFetching && <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}

            {/* Error */}
            {!getUsersQuery.isFetching && getUsersQuery.isError && <div className="alert alert-danger" role="alert">
                Something went wrong ... <button className="btn btn-danger btn-sm" onClick={() => getUsersQuery.refetch()}>Reload</button>
            </div>}

            {/* Empty data */}
            {!getUsersQuery.isFetching && !getUsersQuery.isError && getUsersQuery.data!.length == 0 && <div className="alert alert-info" role="alert">
                No users yet ...
            </div>}

            {/* Data */}
            {!getUsersQuery.isFetching && !getUsersQuery.isError && getUsersQuery.data!.length > 0 && <div className="row">
                {getUsersQuery.data!.map((user, key) => <div className="col-6" key={key}>
                    <UserCard user={user}/>
                </div>)}
            </div>}
        </>
    }

    function FormUpdateUserInModal() {
        const validationSchema = yup.object({
            name: yup.string().required('Name is required'),
            age: yup.number().required("Age is required"),
            email: yup.string().email().required("Email is required"),
        })

        const initialValues: { name: string, age: number, email: string } = {name: modalFormEdition.user!.name, age: modalFormEdition.user!.age, email: modalFormEdition.user!.email}

        return <Modal show={modalFormEdition.isShown} onHide={() => setModalFormEdition(prev => ({...prev, isShown: false}))}>
            <Modal.Header closeButton>
                <Modal.Title>{modalFormEdition.user!.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, {setStatus, setSubmitting}) => {
                        setTimeout(() => {
                            updateUser(modalFormEdition.user!._id, {name: values.name as string, age: values.age as number, email: values.email as string}).then(r => {
                                queryClient.setQueryData('getUsers', (list: UserModel[] | undefined) => {
                                    if (list) {
                                        console.log(list[list.findIndex(item => item._id == modalFormEdition.user!._id)])
                                        list[list.findIndex(item => item._id == modalFormEdition.user!._id)] = r.data
                                        console.log(list[list.findIndex(item => item._id == modalFormEdition.user!._id)])

                                        return list
                                    }
                                    return []
                                })

                                setSubmitting(false)
                                setModalFormEdition(prev => ({...prev, isShown: false}))
                            }).catch(() => {
                                setStatus('Something went wrong ...')
                                setSubmitting(false)
                            })
                        }, 1500);
                    }}
                >
                    {formik => {
                        const {values, errors, setFieldValue, status, isSubmitting} = formik
                        return <Form autoComplete="off">
                            {status && <div className="alert alert-danger" role="alert">{status}</div>}

                            <div className="row mb-2">
                                <div className="col-2">
                                    <label className="col-form-label">Name</label>
                                </div>
                                <div className="col-10">
                                    <input type="text" name="name" className="form-control" value={values.name} onChange={e => setFieldValue('name', e.target.value)} autoFocus/>
                                    {errors.name && <div className="text-danger">{errors.name}</div>}
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-2">
                                    <label className="col-form-label">Age</label>
                                </div>
                                <div className="col-10">
                                    <input type="text" name="age" className="form-control" value={values.age} onChange={e => setFieldValue('age', e.target.value)}/>
                                    {errors.age && <div className="text-danger">{errors.age}</div>}
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-2">
                                    <label className="col-form-label">Email</label>
                                </div>
                                <div className="col-10">
                                    <input type="text" name="email" className="form-control" value={values.email} onChange={e => setFieldValue('email', e.target.value)}/>
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>
                            </div>

                            <div className="d-flex flex-row-reverse">
                                <button className="btn btn-danger ms-2" type="button" onClick={() => setModalFormEdition(prev => ({...prev, isShown: false}))}>Cancel</button>
                                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                    {!isSubmitting && "Update user"}
                                    {isSubmitting && <span>
                                        Updating <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">...</span>
                                    </div>
                                    </span>}
                                </button>
                            </div>
                        </Form>
                    }}

                </Formik>
            </Modal.Body>
        </Modal>
    }

    function FormSearchUser() {
        const validationSchema = yup.object({
            name: yup.string(),
            age: yup.number(),
            email: yup.string().email(),
        })

        return <Formik
            initialValues={searchFilters}
            validationSchema={validationSchema}
            onSubmit={(values, {setStatus, setSubmitting}) => {
                setSearchFilters(prev => {
                    return {
                        name: values.name || '',
                        age: values.age || '',
                        email: values.email || ''
                    }
                })
            }}
        >
            {formik => {
                const {values, errors, setFieldValue, status, isSubmitting, submitForm} = formik
                return <Form autoComplete="off">
                    {status && <div className="alert alert-danger" role="alert">{status}</div>}

                    <div className="row mb-2">
                        <div className="col-2">
                            <label className="col-form-label">Name</label>
                        </div>
                        <div className="col-10">
                            <input type="text" name="name" className="form-control" value={values.name} onChange={e => setFieldValue('name', e.target.value)}/>
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-2">
                            <label className="col-form-label">Age</label>
                        </div>
                        <div className="col-10">
                            <input type="text" name="age" className="form-control" value={values.age} onChange={e => setFieldValue('age', e.target.value)}/>
                            {errors.age && <div className="text-danger">{errors.age}</div>}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-2">
                            <label className="col-form-label">Email</label>
                        </div>
                        <div className="col-10">
                            <input type="text" name="email" className="form-control" value={values.email} onChange={e => setFieldValue('email', e.target.value)}/>
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                    </div>

                    <div className="d-flex flex-row-reverse">
                        <button className="btn btn-danger ms-2" type="button" onClick={() => setFormSearchUserShown(false)}>Hide</button>
                        <button className="btn btn-warning ms-2" type="button" onClick={() => {
                            setFieldValue('name', '')
                            setFieldValue('age', '')
                            setFieldValue('email', '')
                            submitForm().then()
                        }}>Reset
                        </button>
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                            {!isSubmitting && "Filter"}
                            {isSubmitting && <span>
                                Searching <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">...</span>
                            </div>
                            </span>}
                        </button>
                    </div>
                </Form>
            }}

        </Formik>
    }


    return (
        <div className={"container p-4"}>
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-6">Users</div>
                        <div className="col-6 d-flex flex-row-reverse">
                            <button className="btn btn-primary ms-2" onClick={() => getUsersQuery.refetch()}>Reload list</button>
                            <button className="btn btn-primary ms-2" onClick={() => setFormSearchUserShown(true)}>Search among users</button>
                            <button className="btn btn-primary" onClick={() => setIsCreateUserFormShown(true)}>Add user</button>
                        </div>
                    </div>
                </div>
                <div className="card-body p-4">
                    {/* Add new user */}
                    {isCreateUserFormShown && <div className="mb-4">
                        <FormCreateNewUser/>
                    </div>}

                    {/* Add new user */}
                    {modalFormEdition.isShown && <div className="mb-4">
                        <FormUpdateUserInModal/>
                    </div>}

                    {/* Add new user */}
                    {formSearchUserShown && <div className="mb-4">
                        <FormSearchUser/>
                    </div>}

                    {/* List of users*/}
                    <UsersList/>
                </div>
            </div>
        </div>
    );
}


export default App;
