"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/contexts/ToastContext";
import {
  CubeIcon,
  CogIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useAdminContracts,
  useUpgradeAccountFactory,
  useTransferFactoryOwnership,
  useAddSupportedToken,
  useUpgradeLiquidityContract,
  useUpdateOracleAddress,
} from "@/hooks/api/useAdminContracts";
import {
  contractFactorySchema,
  type ContractFormData,
} from "@/lib/validations/contract";

export default function ContractsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "overview" | "factory" | "liquidity"
  >("overview");
  const [processing, setProcessing] = useState(false);

  // Form setup with react-hook-form and zod
  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFactorySchema),
    defaultValues: {
      newClassHash: "",
      newOwnerAddress: "",
      tokenSymbol: "",
      tokenAddress: "",
      oracleAddress: "",
    },
  });

  // Data fetching
  const { data: contracts, isLoading: loading } = useAdminContracts();

  // Mutations
  const { mutateAsync: upgradeAccountFactory } = useUpgradeAccountFactory();
  const { mutateAsync: transferFactoryOwnership } =
    useTransferFactoryOwnership();
  const { mutateAsync: addSupportedToken } = useAddSupportedToken();
  const { mutateAsync: upgradeLiquidityContract } =
    useUpgradeLiquidityContract();
  const { mutateAsync: updateOracleAddress } = useUpdateOracleAddress();

  const handleFormSubmit = async (formData: ContractFormData) => {
    try {
      setProcessing(true);

      switch (activeTab) {
        case "factory":
          if (formData.newClassHash) {
            await upgradeAccountFactory(formData.newClassHash);
            addToast("Account factory upgraded successfully", "success");
            form.reset({ newClassHash: "" });
          } else if (formData.newOwnerAddress) {
            await transferFactoryOwnership(formData.newOwnerAddress);
            addToast("Ownership transferred successfully", "success");
            form.reset({ newOwnerAddress: "" });
          }
          break;

        case "liquidity":
          if (formData.tokenSymbol && formData.tokenAddress) {
            await addSupportedToken({
              symbol: formData.tokenSymbol,
              address: formData.tokenAddress,
            });
            addToast("Token added successfully", "success");
            form.reset({ tokenSymbol: "", tokenAddress: "" });
          } else if (formData.newClassHash) {
            await upgradeLiquidityContract(formData.newClassHash);
            addToast("Liquidity contract upgraded successfully", "success");
            form.reset({ newClassHash: "" });
          } else if (formData.oracleAddress) {
            await updateOracleAddress(formData.oracleAddress);
            addToast("Oracle address updated successfully", "success");
            form.reset({ oracleAddress: "" });
          }
          break;
      }
    } catch (error: any) {
      addToast(error.message || "Operation failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <CubeIcon className="h-8 w-8 mr-3 text-purple-400" />
                Contract Management
              </h1>
              <p className="mt-2 text-gray-400">
                Manage StarkNet smart contracts and configurations
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("factory")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "factory"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Account Factory
            </button>
            <button
              onClick={() => setActiveTab("liquidity")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "liquidity"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Liquidity Pool
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contracts?.map((contract, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span>{contract.type}</span>
                        <Badge
                          className={
                            contract.status === "active"
                              ? "bg-green-900 text-green-400 border-green-700"
                              : "bg-red-900 text-red-400 border-red-700"
                          }
                        >
                          {contract.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">Address</p>
                        <p className="text-sm text-white font-mono break-all">
                          {contract.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Owner</p>
                        <p className="text-sm text-white font-mono break-all">
                          {contract.owner}
                        </p>
                      </div>
                      {contract.classHash && (
                        <div>
                          <p className="text-xs text-gray-400">Class Hash</p>
                          <p className="text-sm text-white font-mono break-all">
                            {contract.classHash}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Account Factory Tab */}
          {activeTab === "factory" && (
            <div className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleFormSubmit)}
                  className="space-y-6"
                >
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <ArrowPathIcon className="h-5 w-5 mr-2 text-purple-400" />
                        Upgrade Account Factory
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="newClassHash"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              New Class Hash
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0x..."
                                {...field}
                                disabled={processing}
                                className="bg-gray-900 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={processing || !form.watch("newClassHash")}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
                      >
                        {processing ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <ArrowPathIcon className="h-5 w-5 mr-2" />
                            Upgrade Contract
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              </Form>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleFormSubmit)}
                  className="space-y-6"
                >
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 mr-2 text-orange-400" />
                        Transfer Ownership
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="newOwnerAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              New Owner Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0x..."
                                {...field}
                                disabled={processing}
                                className="bg-gray-900 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={processing || !form.watch("newOwnerAddress")}
                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600"
                      >
                        {processing ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <ShieldCheckIcon className="h-5 w-5 mr-2" />
                            Transfer Ownership
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </div>
          )}

          {/* Liquidity Pool Tab */}
          {activeTab === "liquidity" && (
            <div className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleFormSubmit)}
                  className="space-y-6"
                >
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <BanknotesIcon className="h-5 w-5 mr-2 text-green-400" />
                        Add Supported Token
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="tokenSymbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Token Symbol
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="STRK, ETH, USDC..."
                                {...field}
                                disabled={processing}
                                className="bg-gray-900 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tokenAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Token Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0x..."
                                {...field}
                                disabled={processing}
                                className="bg-gray-900 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={
                          processing ||
                          !form.watch("tokenSymbol") ||
                          !form.watch("tokenAddress")
                        }
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                      >
                        {processing ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <BanknotesIcon className="h-5 w-5 mr-2" />
                            Add Token
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              </Form>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleFormSubmit)}
                  className="space-y-6"
                >
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <ArrowPathIcon className="h-5 w-5 mr-2 text-purple-400" />
                        Upgrade Liquidity Contract
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="newClassHash"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              New Class Hash
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0x..."
                                {...field}
                                disabled={processing}
                                className="bg-gray-900 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={processing || !form.watch("newClassHash")}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
                      >
                        {processing ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <ArrowPathIcon className="h-5 w-5 mr-2" />
                            Upgrade Contract
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              </Form>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleFormSubmit)}
                  className="space-y-6"
                >
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <CogIcon className="h-5 w-5 mr-2 text-blue-400" />
                        Update Oracle Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="oracleAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Pragma Oracle Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0x..."
                                {...field}
                                disabled={processing}
                                className="bg-gray-900 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={processing || !form.watch("oracleAddress")}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                      >
                        {processing ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <CogIcon className="h-5 w-5 mr-2" />
                            Update Oracle
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
