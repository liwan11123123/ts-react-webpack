import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { observable, runInAction } from 'mobx'
import { Form, Icon, Input, Button, Radio } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

import * as styles from './index.scss'
import { LOGIN_CATEGORY } from '@constants/index'

const FormItem = Form.Item

interface IStoreProps {
    routerStore?: RouterStore
    login?: (data: IUserStore.LoginParams) => Promise<any>
}

@inject(
    (store: IStore): IStoreProps => {
        const { routerStore, userStore } = store
        const { login } = userStore
        return {
            routerStore,
            login
        }
    }
)
@observer
class Login extends React.Component<IStoreProps & FormComponentProps> {
    @observable
    private loading: boolean = false

    submit = (e: React.FormEvent<any>): void => {
        e.preventDefault()
        this.props.form.validateFields(
            async (err, values): Promise<any> => {
                if (!err) {
                    runInAction('SHOW_LOGIN_LOADING', () => {
                        this.loading = true
                    })
                    try {
                        await this.props.login(values)
                        this.props.routerStore.history.replace('/')
                    } catch (err) {
                        console.error(err)
                    }
                    runInAction('HIDE_LOGIN_LOADING', () => {
                        this.loading = false
                    })
                }
            }
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className={styles.login}>
                <Form onSubmit={this.submit} className={styles.form}>
                    <div className={styles.logoBox}>
                        <Icon type="ant-design" />
                    </div>
                    <FormItem>
                        {getFieldDecorator('account', {
                            rules: [
                                {
                                    required: true
                                }
                            ]
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="account"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true
                                }
                            ]
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="password"
                            />
                        )}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="mock auth">
                        {getFieldDecorator('category', {
                            initialValue: LOGIN_CATEGORY[0]
                        })(
                            <Radio.Group>
                                {LOGIN_CATEGORY.map(c => (
                                    <Radio key={c} value={c}>
                                        {c}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" block loading={this.loading}>
                            login
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create<{}>()(Login)
