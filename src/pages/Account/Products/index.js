import React, { useState } from 'react';
import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import Spinner from 'components/ui/Spinner';
import CurrencyInput from 'components/CurrencyInput';
import { Centered } from 'components/styled/common';
import {
  Typography,
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Popconfirm
} from 'antd';

const { Title } = Typography;

const Header = styled.header`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin: 0;
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation createProduct($object: CreateProductProductsInsertInput!) {
    createProduct(object: $object) {
      id
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts($account_id: uuid!) {
    products(
      where: { account_id: { _eq: $account_id } }
      order_by: { created: asc }
    ) {
      id
      name
      description
      price
      flexible_price
      account_access
      download_access
      recurring
      access_length
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation updateProduct(
    $product_id: uuid!
    $object: UpdateProductProductsSetInput!
  ) {
    updateProduct(id: $product_id, object: $object) {
      id
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: uuid!) {
    delete_products_by_pk(id: $id) {
      id
    }
  }
`;

const ProductCard = styled(Card)`
  margin-bottom: 10px;
`;

export default function Products() {
  const { id: account_id } = useParams();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS, {
    variables: { account_id }
  });

  const [createProduct, { loading: creatingProduct }] = useMutation(
    CREATE_PRODUCT
  );

  const [updateProduct, { loading: updatingProduct }] = useMutation(
    UPDATE_PRODUCT
  );

  const [deleteProduct, { loading: deletingProduct }] = useMutation(
    DELETE_PRODUCT
  );

  if (loading) {
    return (
      <Centered height="calc(100vh - 184px)">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

  const products = data?.products;

  const onFinish = async (data) => {
    if (user?.isAdmin) {
      data.created_by = user.id;
    }

    if (data.id) {
      let _set = { ...data };
      delete _set.id;
      try {
        await updateProduct({
          variables: {
            product_id: data.id,
            object: _set
          }
        });
        message.success('Successfully updated product');
        form.resetFields();
        setShowModal(false);
        refetch();
      } catch (e) {
        message.error('An error occurred');
        throw e;
      }
    } else {
      data.account_id = account_id;
      try {
        await createProduct({
          variables: {
            object: data
          }
        });
        message.success('Successfully created product');
        form.resetFields();
        setShowModal(false);
        refetch();
      } catch (e) {
        message.error('An error occurred');
        throw e;
      }
    }
  };

  const handleClickEdit = (product) => {
    form.setFieldsValue(product);
    setShowModal(true);
  };

  const handleClickDelete = async (id) => {
    try {
      await deleteProduct({ variables: { id } });
      refetch();
    } catch (e) {
      if (e.message.includes('foreign key')) {
        message.error(
          'Sorry, this product cannot be deleted because it is in use.'
        );
      } else {
        message.error('An error occurred');
        throw e;
      }
    }
  };

  return (
    <article className="min-h-page">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Header>
          <Title level={3}>Products</Title>
          <Button type="primary" onClick={() => setShowModal(true)}>
            Add Product
          </Button>
        </Header>

        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.name}
            bordered={false}
            style={{ width: 300 }}
          >
            <p>{product.description}</p>
            <p>Price: {product.price}</p>
            {product.flexible_price && (
              <p>
                Name Your Own Price: {product.flexible_price ? 'Yes' : 'No'}
              </p>
            )}
            {product.recurring && (
              <p>Recurs every {product.access_length} days</p>
            )}
            {!product.recurring && (
              <p>Access for {product.access_length} days</p>
            )}
            {product.account_access && (
              <p>Account Access: {product.account_access ? 'Yes' : 'No'}</p>
            )}
            {product.download_access && (
              <p>Download Access: {product.download_access ? 'Yes' : 'No'}</p>
            )}
            <Button onClick={() => handleClickEdit(product)}>Edit</Button>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => handleClickDelete(product.id)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button loading={deletingProduct}>Delete</Button>
            </Popconfirm>
          </ProductCard>
        ))}

        <Modal
          title="Create Product"
          visible={showModal}
          footer={null}
          onCancel={() => setShowModal(false)}
        >
          <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
            <Form.Item name="id" style={{ display: 'none' }}></Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Required' }]}
            >
              <CurrencyInput
                className="ant-input"
                style={{ maxWidth: '10rem' }}
              />
            </Form.Item>

            {/* <Form.Item
            name="flexible_price"
            label="Name Your Own Price"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item> */}

            <Form.Item
              name="account_access"
              label="Full Account Access"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="download_access"
              label="Download Access"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Access Length (days)"
              name="access_length"
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber />
            </Form.Item>

            <Form.Item
              name="recurring"
              label="Recurring"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>

            <Button
              loading={creatingProduct || updatingProduct}
              key="submit"
              htmlType="submit"
              type="primary"
              size="large"
            >
              Save Product
            </Button>
          </Form>
        </Modal>
      </div>
    </article>
  );
}
